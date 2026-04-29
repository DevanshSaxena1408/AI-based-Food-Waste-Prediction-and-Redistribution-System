# Food Waste Management System - Project Structure

```
Food waste/
│
├── README.md                    # Comprehensive documentation
├── QUICKSTART.md               # Quick setup guide
├── PROJECT_SUMMARY.md          # Project overview
├── ML_MODEL_SETUP.md           # ML model setup guide
├── PROJECT_STRUCTURE.md        # This file
├── .gitignore                  # Git ignore rules
├── setup.sh                    # Linux/Mac setup script
└── setup.bat                   # Windows setup script
│
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── main.py            # Main FastAPI app with all routes
│   │   │                      # - 16 API endpoints
│   │   │                      # - Authentication, Donations, ML, Admin
│   │   │
│   │   ├── models.py          # Pydantic data models
│   │   │                      # - UserRegister, UserLogin, UserResponse
│   │   │                      # - DonationCreate, DonationResponse, DonationClaim
│   │   │                      # - WastagePredictionInput, WastagePredictionResponse
│   │   │
│   │   ├── auth.py            # Authentication utilities
│   │   │                      # - JWT token creation/validation
│   │   │                      # - Password hashing with bcrypt
│   │   │                      # - get_current_user, get_current_admin
│   │   │
│   │   ├── email_service.py   # SMTP Email Service
│   │   │                      # - send_donation_notification_to_ngos()
│   │   │                      # - send_acceptance_notification_to_donor()
│   │   │
│   │   ├── ml_service.py      # ML Prediction Service
│   │   │                      # - Load Random Forest model
│   │   │                      # - predict_wastage()
│   │   │
│   │   └── utils.py           # Utility functions
│   │                          # - calculate_distance() using Haversine
│   │                          # - filter_by_distance()
│   │
│   ├── database/
│   │   ├── db_handler.py      # JSON Database Handler
│   │   │                      # - User CRUD operations
│   │   │                      # - Donation CRUD operations
│   │   │                      # - Request CRUD operations
│   │   │
│   │   ├── auth.json          # User authentication data (auto-generated)
│   │   └── data.json          # Donations and requests (auto-generated)
│   │
│   ├── models/                # ML Models Directory
│   │   ├── random_forest_model.pkl    # Trained Random Forest model
│   │   └── preprocessor.pkl           # Feature preprocessor
│   │
│   ├── uploads/               # Uploaded food images (auto-generated)
│   │
│   ├── requirements.txt       # Python dependencies
│   │                          # - fastapi, uvicorn, scikit-learn, etc.
│   │
│   └── .env.example           # Environment variables template
│                              # - SECRET_KEY, SMTP credentials
│
└── frontend/                  # React Frontend
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx              # Navigation bar component
    │   │   │                           # - Dynamic links based on user role
    │   │   │                           # - Logout functionality
    │   │   │
    │   │   └── PrivateRoute.jsx        # Protected route wrapper
    │   │                               # - Authentication check
    │   │                               # - Role-based access control
    │   │
    │   ├── pages/
    │   │   ├── Login.jsx               # Login page
    │   │   ├── Register.jsx            # Registration page (role-based)
    │   │   │
    │   │   ├── Dashboard.jsx           # Main dashboard router
    │   │   │                           # - Routes to role-specific dashboards
    │   │   │
    │   │   ├── RestaurantDashboard.jsx # Restaurant/Donor dashboard
    │   │   │                           # - View all donations
    │   │   │                           # - Statistics (total, pending, accepted)
    │   │   │
    │   │   ├── CreateDonation.jsx      # Create donation form
    │   │   │                           # - Image upload
    │   │   │                           # - GPS coordinates
    │   │   │                           # - All donation fields
    │   │   │
    │   │   ├── NGODashboard.jsx        # NGO dashboard
    │   │   │                           # - Browse available donations
    │   │   │                           # - Location-based filtering
    │   │   │                           # - Claim donations
    │   │   │                           # - Distance calculation
    │   │   │
    │   │   ├── AdminDashboard.jsx      # Admin control panel
    │   │   │                           # - View all users
    │   │   │                           # - View all donations
    │   │   │                           # - Filter by role
    │   │   │                           # - Delete operations
    │   │   │                           # - Statistics
    │   │   │
    │   │   └── WastagePrediction.jsx   # ML wastage prediction
    │   │                               # - Input form (10 parameters)
    │   │                               # - Display results
    │   │                               # - Recommendations
    │   │
    │   ├── services/
    │   │   └── api.js                  # API service layer
    │   │                               # - Axios configuration
    │   │                               # - authAPI, donationAPI, predictionAPI
    │   │                               # - adminAPI, uploadImage
    │   │                               # - JWT token interceptor
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx         # Authentication context
    │   │                               # - User state management
    │   │                               # - login(), register(), logout()
    │   │                               # - isAuthenticated
    │   │
    │   ├── App.jsx                     # Main app component
    │   │                               # - Routing configuration
    │   │                               # - Protected routes
    │   │                               # - Role-based navigation
    │   │
    │   ├── App.css                     # Global styles
    │   │                               # - Responsive design
    │   │                               # - Component styles
    │   │                               # - Form styles
    │   │
    │   └── main.jsx                    # React entry point
    │
    ├── index.html              # HTML template
    ├── package.json            # Node.js dependencies
    │                          # - react, react-router-dom, axios
    │
    └── vite.config.js          # Vite configuration
                               # - Proxy to backend API
                               # - Dev server settings
```

## Component Relationships

### Backend Flow
```
main.py (FastAPI App)
    ├─> auth.py (JWT tokens)
    ├─> models.py (Data validation)
    ├─> db_handler.py (JSON storage)
    ├─> email_service.py (Notifications)
    ├─> ml_service.py (Predictions)
    └─> utils.py (Location services)
```

### Frontend Flow
```
main.jsx
    └─> App.jsx
        ├─> AuthContext (Global state)
        ├─> Navbar (Navigation)
        └─> Routes
            ├─> Login/Register (Public)
            └─> PrivateRoute
                ├─> Dashboard (Role router)
                │   ├─> RestaurantDashboard
                │   ├─> NGODashboard
                │   └─> AdminDashboard
                ├─> CreateDonation
                ├─> WastagePrediction
                └─> api.js (Backend calls)
```

## API Endpoint Mapping

### Authentication Endpoints
```
POST /api/auth/register  → main.py:register()
POST /api/auth/login     → main.py:login()
GET  /api/auth/me        → main.py:get_me()
```

### Donation Endpoints
```
POST /api/donations           → main.py:create_donation()
GET  /api/donations           → main.py:get_donations()
GET  /api/donations/{id}      → main.py:get_donation()
POST /api/donations/claim     → main.py:claim_donation()
```

### ML Endpoint
```
POST /api/predict/wastage     → main.py:predict_wastage()
                              → ml_service.predict_wastage()
```

### Admin Endpoints
```
GET    /api/admin/users            → main.py:get_all_users()
GET    /api/admin/ngos             → main.py:get_all_ngos()
GET    /api/admin/restaurants      → main.py:get_all_restaurants()
PUT    /api/admin/users/{id}       → main.py:update_user()
DELETE /api/admin/users/{id}       → main.py:delete_user()
PUT    /api/admin/donations/{id}   → main.py:update_donation_admin()
DELETE /api/admin/donations/{id}   → main.py:delete_donation()
```

### File Upload
```
POST /api/upload/image        → main.py:upload_image()
```

## Data Flow Examples

### Donation Creation Flow
```
User (Frontend)
    ↓ [Fill form]
CreateDonation.jsx
    ↓ [POST /api/donations]
api.js
    ↓ [Axios request with JWT]
main.py:create_donation()
    ↓ [Validate with Pydantic]
db_handler.create_donation()
    ↓ [Save to data.json]
email_service.send_donation_notification_to_ngos()
    ↓ [SMTP emails]
All NGOs receive notification ✉
    ↓ [Response]
Frontend updates ✓
```

### Donation Claim Flow
```
NGO (Frontend)
    ↓ [Click "Claim"]
NGODashboard.jsx
    ↓ [POST /api/donations/claim]
api.js
    ↓ [Axios request with JWT]
main.py:claim_donation()
    ↓ [Update status]
db_handler.update_donation()
    ↓ [Save to data.json]
email_service.send_acceptance_notification_to_donor()
    ↓ [SMTP email]
Donor receives confirmation ✉
    ↓ [Response]
Frontend updates ✓
```

### ML Prediction Flow
```
User (Frontend)
    ↓ [Fill prediction form]
WastagePrediction.jsx
    ↓ [POST /api/predict/wastage]
api.js
    ↓ [Axios request]
main.py:predict_wastage()
    ↓ [Validate input]
ml_service.predict_wastage()
    ↓ [Preprocess data]
preprocessor.transform()
    ↓ [Make prediction]
random_forest_model.predict()
    ↓ [Calculate percentage]
Return results
    ↓ [Display]
Frontend shows wastage % ✓
```

## Key Files Explained

### Backend Core Files

**main.py** (500+ lines)
- FastAPI application initialization
- 16 API endpoints
- CORS middleware
- Static file serving
- Request/response handling

**db_handler.py** (300+ lines)
- JSON file operations
- CRUD methods for users, donations, requests
- Singleton pattern

**email_service.py** (100+ lines)
- SMTP configuration
- HTML email templates
- Notification functions

**ml_service.py** (80+ lines)
- Model loading
- Feature preprocessing
- Prediction logic

### Frontend Core Files

**App.jsx**
- React Router configuration
- Protected routes
- Role-based access

**AuthContext.jsx**
- Global authentication state
- Token management
- User data storage

**api.js**
- Centralized API calls
- JWT token injection
- Error handling

**Dashboard Pages** (3 files)
- RestaurantDashboard: Donation management
- NGODashboard: Browse & claim
- AdminDashboard: System management

## File Count Summary

- **Backend Python Files**: 10
- **Frontend JSX Files**: 12
- **Configuration Files**: 7
- **Documentation Files**: 6
- **Total Project Files**: 35+

## Lines of Code

- **Backend**: ~1,500 lines
- **Frontend**: ~1,500 lines
- **Total**: ~3,000+ lines (excluding comments)

## Technologies Used

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Backend | FastAPI | REST API framework |
| Backend | Pydantic | Data validation |
| Backend | Jose | JWT authentication |
| Backend | Passlib | Password hashing |
| Backend | scikit-learn | ML predictions |
| Backend | SMTP | Email service |
| Frontend | React 18 | UI framework |
| Frontend | React Router | Navigation |
| Frontend | Axios | HTTP client |
| Frontend | Vite | Build tool |
| Database | JSON | Data storage |
| ML | Random Forest | Wastage prediction |

## Deployment Architecture

```
┌─────────────────┐
│   Web Browser   │
│  (localhost:3000)│
└────────┬────────┘
         │ HTTP Requests
         ↓
┌─────────────────┐
│  React Frontend │
│     (Vite)      │
└────────┬────────┘
         │ API Calls
         ↓
┌─────────────────┐
│  FastAPI Backend│
│ (localhost:8000)│
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌──────┐
│ JSON DB│ │  ML  │
│ Files  │ │Model │
└────────┘ └──────┘
         │
         ↓
    ┌────────┐
    │  SMTP  │
    │ Server │
    └────────┘
```

## Conclusion

This project structure follows best practices for full-stack development with clear separation of concerns, modular code organization, and comprehensive documentation.
