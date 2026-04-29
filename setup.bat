@echo off
echo =====================================
echo Food Waste Management System Setup
echo =====================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js 16 or higher.
    pause
    exit /b 1
)

echo Step 1: Setting up Backend...
cd backend

REM Create virtual environment
echo Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create .env file if it doesn't exist
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo.
    echo WARNING: Please edit backend\.env file with your SMTP credentials!
    echo.
)

REM Create necessary directories
if not exist database mkdir database
if not exist uploads mkdir uploads
if not exist models mkdir models

cd ..

echo.
echo Step 2: Setting up Frontend...
cd frontend

REM Install Node.js dependencies
echo Installing Node.js dependencies...
call npm install

cd ..

echo.
echo =====================================
echo Setup Complete!
echo =====================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your SMTP email credentials
echo 2. Place your ML model files in backend\models\
echo    - random_forest_model.pkl
echo    - preprocessor.pkl
echo.
echo To run the application:
echo.
echo Terminal 1 (Backend):
echo   cd backend
echo   venv\Scripts\activate
echo   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
echo.
echo Terminal 2 (Frontend):
echo   cd frontend
echo   npm run dev
echo.
echo Then open http://localhost:3000 in your browser
echo =====================================
pause
