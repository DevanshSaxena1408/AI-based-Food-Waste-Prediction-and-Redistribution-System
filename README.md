# Food Waste Management System

A comprehensive full-stack web application to reduce food waste by connecting restaurants/donors with NGOs. Built with FastAPI (backend), React (frontend), and Machine Learning for wastage prediction.

## Features

### For Restaurants/Donors
- **Interactive map** to select pickup location (click on map)
- Create food donation listings with images, expiry dates, and location
- View donation history and status (Pending/Accepted)
- Predict food wastage using ML model
- Automatic email notifications to NGOs when donations are created
- Receive confirmation emails when NGOs accept donations

### For NGOs
- **Map View** - See all donations on an interactive map with color-coded markers
- **List View** - Traditional card-based donation browsing
- Browse available food donations
- Location-based filtering (distance calculation)
- Claim donations with one click
- View claimed donation history
- Automatic email notifications for new donations

### For Admins
- View all users, donations, and statistics
- Manage users (view, delete)
- Manage donations (view, delete)
- Separate views for restaurants and NGOs
- Comprehensive dashboard with statistics

### General Features
- **AUTOMATIC Location Detection** - Browser GPS + free reverse geocoding (address auto-fills!)
- **FREE Interactive Maps** - Powered by Leaflet.js & OpenStreetMap (no API keys, no costs)
- **Click-to-select** location on map instead of manual coordinate entry
- Role-based authentication (Restaurant, NGO, Admin)
- JWT token-based security
- Email notifications via SMTP
- Image upload for food donations
- Location-based services with GPS coordinates and distance calculation
- Machine Learning wastage prediction

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Python 3.8+**
- **Pydantic** - Data validation
- **Jose** - JWT tokens
- **Passlib** - Password hashing
- **scikit-learn** - ML predictions
- **SMTP** - Email notifications

### Frontend
- **React 18**
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Leaflet.js** - Interactive maps (FREE)
- **React-Leaflet** - React wrapper for Leaflet
- **OpenStreetMap** - Map tiles (FREE, no API key)

### Database
- **JSON-based storage** (auth.json, data.json)

### Machine Learning
- **Random Forest** algorithm for wastage prediction
- Pre-trained model saved in `models/` folder

## Project Structure

```
Food waste/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app and routes
│   │   ├── models.py            # Pydantic models
│   │   ├── auth.py              # Authentication utilities
│   │   ├── email_service.py     # Email notifications
│   │   ├── ml_service.py        # ML prediction service
│   │   └── utils.py             # Utility functions
│   ├── database/
│   │   ├── db_handler.py        # JSON database handler
│   │   ├── auth.json            # User authentication data
│   │   └── data.json            # Donations and requests
│   ├── models/
│   │   ├── random_forest_model.pkl    # Trained ML model
│   │   └── preprocessor.pkl           # Data preprocessor
│   ├── uploads/                 # Uploaded images
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── LocationPicker.jsx       # Interactive map for location selection
│   │   │   └── DonationsMap.jsx         # Map view for donations
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── RestaurantDashboard.jsx
│   │   │   ├── NGODashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── CreateDonation.jsx
│   │   │   └── WastagePrediction.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── App.jsx              # Main app component
│   │   ├── App.css              # Styles
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file from the example:
```bash
cp .env.example .env
```

5. Edit the `.env` file with your configuration:
```env
SECRET_KEY=your-secret-key-here-make-it-long-and-random
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

**Important:** For Gmail:
- Enable 2-factor authentication
- Generate an "App Password" from Google Account settings
- Use that app password as SENDER_PASSWORD

6. Ensure your ML model files are in the `models/` folder:
- `random_forest_model.pkl`
- `preprocessor.pkl`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Start the Backend Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at `http://localhost:8000`

API documentation (Swagger UI): `http://localhost:8000/docs`

### Start the Frontend Server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage Guide

### 1. Register an Account

Visit `http://localhost:3000/register` and create an account:

**For Restaurants:**
- Select role: "Restaurant Owner / Donor"
- Fill in restaurant details (name, license number)
- Provide location coordinates (latitude/longitude)

**For NGOs:**
- Select role: "NGO"
- Fill in organization details
- Provide location coordinates

**For Admins:**
- Select role: "Admin"
- Fill in basic details

### 2. Restaurant/Donor Workflow

1. **Login** to your restaurant account
2. **Create Donation:**
   - Click "Create Donation" in navbar
   - Fill in meal details, quantity, expiry date
   - Upload food image (optional)
   - Provide pickup location
   - Submit
   - All NGOs receive email notifications automatically

3. **View Dashboard:**
   - See all your donations
   - Track status (Pending/Accepted)
   - View which NGO claimed your donation

4. **Predict Wastage:**
   - Click "Predict Wastage"
   - Enter event details and food quantity
   - Get ML prediction of potential wastage
   - Plan accordingly to reduce waste

### 3. NGO Workflow

1. **Login** to your NGO account
2. **Browse Donations:**
   - See all available food donations
   - Use location filter to find nearby donations
   - View donation details, expiry dates, images

3. **Claim Donation:**
   - Click "Claim Donation" on any pending donation
   - Donor receives automatic email with your contact details
   - Coordinate pickup with the donor

4. **View History:**
   - See all donations you've claimed
   - Track your impact

### 4. Admin Workflow

1. **Login** to admin account
2. **View Dashboard:**
   - See system statistics
   - Total users, restaurants, NGOs, donations

3. **Manage Data:**
   - View all users, donations
   - Filter by type (restaurants, NGOs)
   - Delete users or donations if needed

## Interactive Map Features

### FREE & Unlimited
- **No API keys required** - Uses OpenStreetMap (open-source)
- **No usage limits** - Completely free forever
- **No signup needed** - Just install and use
- **Full documentation** - See [MAP_INTEGRATION.md](MAP_INTEGRATION.md)

### 🆕 Automatic Location Detection
- **GPS Auto-detection** - Automatically detects your location on page load
- **Address Auto-fill** - Reverse geocoding fills in your full address
- **One-Click Allow** - Just click "Allow" when browser prompts
- **Re-detect Button** - Manual trigger if needed
- **Smart Fallbacks** - Manual entry still available
- **Full guide** - See [AUTO_LOCATION.md](AUTO_LOCATION.md)

### Location Selection (Registration & Donation Creation)
- **Auto-detects on load** - No need to enter anything!
- **Click on map** to adjust your location if needed
- Automatic marker placement
- Real-time coordinate display
- Manual coordinate entry also supported
- Default center: Delhi, India (customizable)

### Map View for NGOs
- **Two view modes:**
  - **List View** - Traditional card-based browsing
  - **Map View** - See all donations on interactive map
- **Color-coded markers:**
  - 🟢 Green - Available donations (Pending)
  - 🔴 Red - Claimed donations (Accepted)
  - 🔵 Blue - Your location
- **Click markers** to see donation details in popup
- **Distance display** from your location
- **Filters work** on map view (status, distance)

### Map Controls
- **Zoom:** Mouse wheel, +/- buttons, pinch gesture
- **Pan:** Click and drag
- **Responsive:** Works on desktop, tablet, mobile
- **Touch-friendly:** Full touch support

For detailed map documentation, see [MAP_INTEGRATION.md](MAP_INTEGRATION.md)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Donations
- `POST /api/donations` - Create donation (Restaurant)
- `GET /api/donations` - Get all donations (with filters)
- `GET /api/donations/{id}` - Get donation by ID
- `POST /api/donations/claim` - Claim donation (NGO)

### Predictions
- `POST /api/predict/wastage` - Predict food wastage (Restaurant)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/ngos` - Get all NGOs
- `GET /api/admin/restaurants` - Get all restaurants
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `PUT /api/admin/donations/{id}` - Update donation
- `DELETE /api/admin/donations/{id}` - Delete donation

### File Upload
- `POST /api/upload/image` - Upload image

## Machine Learning Model

The system uses a Random Forest model trained on restaurant food wastage data. The model predicts potential food wastage based on:

- Type of food
- Number of guests
- Event type
- Quantity
- Storage conditions
- Purchase history
- Seasonality
- Preparation method
- Geographical location
- Pricing

**Training the Model:**

If you need to retrain the model with your data:

```python
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib

# Load your dataset
data = pd.read_csv('your_wastage_data.csv')

# Preprocessing (as shown in your reference code)
# ... preprocessing code ...

# Train model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, 'models/random_forest_model.pkl')
joblib.dump(preprocessor, 'models/preprocessor.pkl')
```

## Email Notifications

The system sends automatic emails for:

1. **New Donation Alert** - Sent to all NGOs when a restaurant creates a donation
2. **Acceptance Confirmation** - Sent to donor when an NGO claims their donation (includes NGO contact details)

## Location-Based Features

- Both restaurants and NGOs register with GPS coordinates (latitude/longitude)
- NGOs can filter donations by distance
- Haversine formula calculates distances between locations
- Results sorted by proximity

**Getting Coordinates:**
- Use Google Maps: Right-click location → Click coordinates
- Or use any GPS service

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Protected API endpoints
- CORS configuration

## Troubleshooting

### Backend Issues

**Database not found:**
- The database files (auth.json, data.json) are created automatically on first run
- Check `backend/database/` folder

**Email not sending:**
- Verify SMTP credentials in .env file
- For Gmail, ensure you're using an App Password, not your regular password
- Check firewall/antivirus settings

**ML model not found:**
- Ensure model files are in `backend/models/` folder
- Files needed: `random_forest_model.pkl`, `preprocessor.pkl`

### Frontend Issues

**Cannot connect to backend:**
- Ensure backend is running on port 8000
- Check proxy settings in `vite.config.js`

**Images not displaying:**
- Check that uploaded images are in `backend/uploads/` folder
- Verify image URLs in browser console

## Future Enhancements

- Real-time notifications with WebSockets
- Mobile app version
- Map integration (Google Maps API)
- Rating system for restaurants/NGOs
- Analytics dashboard
- Multi-language support
- SMS notifications
- Blockchain for donation tracking

## Dataset

The ML model is trained on the Kaggle dataset: [Food Wastage Data in Restaurant](https://www.kaggle.com/datasets/trevinhannibal/food-wastage-data-in-restaurant)

## License

This project is for educational purposes.

## Support

For issues or questions, please create an issue in the project repository.

## Contributors

Developed as part of a college project to address food waste management.
