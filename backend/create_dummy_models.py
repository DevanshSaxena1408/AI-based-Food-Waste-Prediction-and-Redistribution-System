"""
Create dummy ML models for testing
"""
import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler, OrdinalEncoder
from sklearn.compose import ColumnTransformer

# Create models directory
os.makedirs('models', exist_ok=True)

print("Creating dummy ML models for testing...")

# Create dummy data (100 samples, 10 features)
X_dummy = np.random.rand(100, 10)
y_dummy = np.random.rand(100) * 10  # Wastage amounts 0-10 kg

# Create and train a simple Random Forest model
model = RandomForestRegressor(n_estimators=10, random_state=42, max_depth=5)
model.fit(X_dummy, y_dummy)

# Create dummy preprocessor
# Indices: [0, 2, 4, 5, 6, 7, 8] are categorical, [1, 3, 9] are numerical
preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), [1, 3, 9]),  # numerical indices: number_of_guests, quantity, pricing
        ('cat', OrdinalEncoder(), [0, 2, 4, 5, 6, 7, 8]),  # categorical indices
    ]
)

# Fit the preprocessor
preprocessor.fit(X_dummy)

# Save models
joblib.dump(model, 'models/random_forest_model.pkl')
joblib.dump(preprocessor, 'models/preprocessor.pkl')

print("✓ Dummy ML models created successfully!")
print("  - models/random_forest_model.pkl")
print("  - models/preprocessor.pkl")
print("\nNote: These are dummy models for testing only.")
print("Replace with your trained models for accurate predictions.")
