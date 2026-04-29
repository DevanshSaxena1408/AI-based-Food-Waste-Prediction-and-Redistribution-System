import joblib
import pandas as pd
import numpy as np
from typing import Dict
import os
import warnings

class MLService:
    def __init__(self, model_path: str = "models/random_forest_model.pkl",
                 preprocessor_path: str = "models/preprocessor.pkl"):
        self.model_path = model_path
        self.preprocessor_path = preprocessor_path
        self.model = None
        self.preprocessor = None
        self.valid_categories = None
        self.load_model()

    def load_model(self):
        """Load the trained model and preprocessor"""
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                print(f"Model loaded from {self.model_path}")
            else:
                print(f"Warning: Model file not found at {self.model_path}")

            if os.path.exists(self.preprocessor_path):
                self.preprocessor = joblib.load(self.preprocessor_path)
                print(f"Preprocessor loaded from {self.preprocessor_path}")

                # Fix the preprocessor to handle unknown categories
                try:
                    if hasattr(self.preprocessor, 'named_transformers_'):
                        ordinal_encoder = self.preprocessor.named_transformers_.get('cat')
                        if ordinal_encoder:
                            # Set handle_unknown to use an encoded value for unknown categories
                            ordinal_encoder.handle_unknown = 'use_encoded_value'
                            ordinal_encoder.unknown_value = -1
                            print("OrdinalEncoder configured to handle unknown categories")

                            # Set valid categories from the training data (from notebook)
                            self.valid_categories = {
                                'Type of Food': ['Meat', 'Vegetables', 'Seafood', 'Dairy', 'Grains', 'Fruits'],
                                'Event Type': ['Corporate', 'Birthday', 'Wedding', 'Anniversary', 'Other'],
                                'Storage Conditions': ['Refrigerated', 'Room Temperature', 'Frozen'],
                                'Purchase History': ['Regular', 'Occasional', 'First Time'],
                                'Seasonality': ['All Seasons', 'Winter', 'Summer', 'Spring', 'Fall'],
                                'Preparation Method': ['Buffet', 'Finger Food', 'Plated', 'Family Style'],
                                'Geographical Location': ['Urban', 'Suburban', 'Rural'],
                                'Pricing': ['Low', 'Moderate', 'High'],
                            }
                            print(f"Valid categories set:")
                            for key, values in self.valid_categories.items():
                                print(f"  {key}: {values}")
                except Exception as e:
                    print(f"Could not configure encoder: {str(e)}")
                    import traceback
                    traceback.print_exc()
            else:
                print(f"Warning: Preprocessor file not found at {self.preprocessor_path}")

        except Exception as e:
            print(f"Error loading model: {str(e)}")

    def predict_wastage(self, input_data: Dict) -> Dict:
        """
        Predict food wastage based on input features

        Expected input features:
        - type_of_food: str
        - number_of_guests: int
        - event_type: str
        - quantity: float
        - storage_conditions: str
        - purchase_history: str
        - seasonality: str
        - preparation_method: str
        - geographical_location: str
        - pricing: float
        """
        try:
            if self.model is None or self.preprocessor is None:
                raise Exception("Model or preprocessor not loaded")

            # Create DataFrame with the input data
            # Map snake_case API input to training column names
            column_mapping = {
                'type_of_food': 'Type of Food',
                'number_of_guests': 'Number of Guests',
                'event_type': 'Event Type',
                'quantity': 'Quantity of Food',
                'storage_conditions': 'Storage Conditions',
                'purchase_history': 'Purchase History',
                'seasonality': 'Seasonality',
                'preparation_method': 'Preparation Method',
                'geographical_location': 'Geographical Location',
                'pricing': 'Pricing'
            }

            # Rename input data keys to match training column names
            renamed_data = {column_mapping.get(k, k): v for k, v in input_data.items()}
            df = pd.DataFrame([renamed_data])

            # Ensure the column order matches training data
            expected_columns = [
                'Type of Food',
                'Number of Guests',
                'Event Type',
                'Quantity of Food',
                'Storage Conditions',
                'Purchase History',
                'Seasonality',
                'Preparation Method',
                'Geographical Location',
                'Pricing'
            ]

            # Reorder columns
            df = df[expected_columns]

            # Preprocess the data - suppress sklearn warnings about feature names
            with warnings.catch_warnings():
                warnings.filterwarnings('ignore', message='X has feature names')
                X_processed = self.preprocessor.transform(df)

                # Make prediction
                prediction = self.model.predict(X_processed)[0]

            # Calculate wastage percentage
            wastage_percentage = (prediction / input_data['quantity']) * 100

            return {
                "wastage_amount": float(prediction),
                "wastage_percentage": float(wastage_percentage),
                "input_quantity": input_data['quantity']
            }
        except ValueError as e:
            error_msg = str(e)
            # Check if it's an unknown category error
            if "unknown categories" in error_msg.lower():
                # Extract which category is problematic
                if self.valid_categories:
                    raise ValueError(
                        f"Invalid category value. {error_msg}\n\n"
                        f"Valid categories:\n"
                        f"- type_of_food: {self.valid_categories.get('Type of Food', 'N/A')}\n"
                        f"- event_type: {self.valid_categories.get('Event Type', 'N/A')}\n"
                        f"- storage_conditions: {self.valid_categories.get('Storage Conditions', 'N/A')}\n"
                        f"- purchase_history: {self.valid_categories.get('Purchase History', 'N/A')}\n"
                        f"- seasonality: {self.valid_categories.get('Seasonality', 'N/A')}\n"
                        f"- preparation_method: {self.valid_categories.get('Preparation Method', 'N/A')}\n"
                        f"- geographical_location: {self.valid_categories.get('Geographical Location', 'N/A')}\n"
                        f"- pricing: {self.valid_categories.get('Pricing', 'N/A')}"
                    )
            raise
        except Exception as e:
            print(f"ML Prediction Error: {str(e)}")
            print(f"Input data: {input_data}")
            import traceback
            traceback.print_exc()
            raise

ml_service = MLService()