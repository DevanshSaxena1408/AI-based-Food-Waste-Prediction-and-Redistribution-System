# Quick Start Guide

## Automated Setup

### For Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

### For Windows:
```bash
setup.bat
```

## Manual Setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your SMTP credentials
```

### Frontend

```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Backend:
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### Access the Application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## First Steps

1. **Register an account** at http://localhost:3000/register
   - Choose role: Restaurant, NGO, or Admin
   - Fill in required details including GPS coordinates

2. **For Restaurants:**
   - Create donation listings
   - Use wastage prediction tool
   - Track donation status

3. **For NGOs:**
   - Browse available donations
   - Use location filter
   - Claim donations

4. **For Admins:**
   - View system statistics
   - Manage users and donations

## Important Notes

### Email Configuration (Required)
Edit `backend/.env` with your Gmail credentials:
```env
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-app-password
```

To get Gmail App Password:
1. Enable 2-factor authentication on Google Account
2. Go to Google Account → Security → 2-Step Verification → App passwords
3. Generate new app password
4. Use that password in .env file

### ML Model Files (Required)
Place in `backend/models/` directory:
- `random_forest_model.pkl`
- `preprocessor.pkl`

You mentioned these are already trained and saved.

### GPS Coordinates
You can get coordinates from:
- Google Maps (right-click → click coordinates)
- https://www.latlong.net/
- Any GPS service

Example:
- Delhi: 28.6139, 77.2090
- Mumbai: 19.0760, 72.8777

## Test Accounts

After setup, create test accounts:

**Restaurant Account:**
- Email: restaurant@test.com
- Password: test123
- Role: Restaurant

**NGO Account:**
- Email: ngo@test.com
- Password: test123
- Role: NGO

**Admin Account:**
- Email: admin@test.com
- Password: test123
- Role: Admin

## Troubleshooting

**Backend won't start:**
- Check if port 8000 is available
- Verify Python version (3.8+)
- Ensure all dependencies installed

**Frontend won't start:**
- Check if port 3000 is available
- Verify Node.js version (16+)
- Run `npm install` again

**Emails not sending:**
- Verify SMTP credentials in .env
- Use Gmail App Password, not regular password
- Check internet connection

**ML prediction error:**
- Ensure model files are in `backend/models/`
- Check model file names match exactly

## Features to Test

1. **Registration & Login**
2. **Restaurant: Create donation with image**
3. **NGO: Browse and claim donation**
4. **Email: Check inbox for notifications**
5. **Wastage Prediction: Input data and get prediction**
6. **Admin: View all users and donations**
7. **Location Filter: Test distance-based filtering**

## Development

**Backend API Documentation:**
Visit http://localhost:8000/docs for interactive API documentation (Swagger UI)

**Database Files:**
- `backend/database/auth.json` - User data
- `backend/database/data.json` - Donations and requests

These are created automatically on first run.

## Need Help?

Refer to the main [README.md](README.md) for detailed documentation.
