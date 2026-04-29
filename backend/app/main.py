from fastapi import FastAPI, HTTPException, Depends, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List, Optional
import os
import base64
from datetime import timedelta

from .models import (
    UserRegister, UserLogin, Token, UserResponse,
    DonationCreate, DonationResponse, DonationClaim,
    RequestCreate, RequestResponse,
    WastagePredictionInput, WastagePredictionResponse
)
from .auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_admin, ACCESS_TOKEN_EXPIRE_MINUTES
)
from .email_service import email_service
from .ml_service import ml_service
from .utils import filter_by_distance
import sys
sys.path.append('..')
from database.db_handler import db

app = FastAPI(title="Food Waste Management System", version="1.0.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory
os.makedirs("uploads", exist_ok=True)

# Mount uploads directory for serving images
try:
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
except:
    pass

# Authentication Endpoints
@app.post("/api/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.get_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password
    hashed_password = get_password_hash(user_data.password)

    # Create user dict
    user_dict = user_data.model_dump()
    user_dict["password"] = hashed_password

    # Create user
    created_user = db.create_user(user_dict)

    # Remove password from response
    user_response = {k: v for k, v in created_user.items() if k != "password"}

    # Create access token
    access_token = create_access_token(
        data={"sub": created_user["id"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    """Login user"""
    user = db.get_user_by_email(credentials.email)

    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    # Remove password from response
    user_response = {k: v for k, v in user.items() if k != "password"}

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user_response
    }

@app.get("/api/auth/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current user info"""
    user_response = {k: v for k, v in current_user.items() if k != "password"}
    return user_response

# Donation Endpoints
@app.post("/api/donations", response_model=DonationResponse, status_code=status.HTTP_201_CREATED)
async def create_donation(donation: DonationCreate, current_user: dict = Depends(get_current_user)):
    """Create a new donation (Restaurant/Donor)"""
    if current_user["role"] not in ["restaurant", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurants can create donations"
        )

    # Create donation
    donation_dict = donation.model_dump()
    donation_dict["donor_id"] = current_user["id"]
    donation_dict["donor_name"] = current_user.get("restaurant_name") or current_user.get("name")
    donation_dict["donor_email"] = current_user.get("email")
    donation_dict["donor_contact"] = current_user.get("contact")

    created_donation = db.create_donation(donation_dict)

    # Get all NGO emails
    all_users = db.get_all_users()
    ngo_emails = [user["email"] for user in all_users if user.get("role") == "ngo"]

    # Send notification emails to all NGOs
    if ngo_emails:
        email_service.send_donation_notification_to_ngos(ngo_emails, created_donation)

    return created_donation

@app.get("/api/donations", response_model=List[DonationResponse])
async def get_donations(
    status_filter: Optional[str] = None,
    max_distance: Optional[float] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get all donations with optional filters"""
    donations = db.get_all_donations()

    # Filter by status if provided
    if status_filter:
        donations = [d for d in donations if d["status"] == status_filter]

    # For restaurant users, show only their donations
    if current_user["role"] == "restaurant":
        donations = [d for d in donations if d.get("donor_id") == current_user["id"]]

    # For NGO users, apply location-based filtering
    if current_user["role"] == "ngo" and "latitude" in current_user and "longitude" in current_user:
        donations = filter_by_distance(
            donations,
            current_user["latitude"],
            current_user["longitude"],
            max_distance
        )

    return donations

@app.get("/api/donations/{donation_id}", response_model=DonationResponse)
async def get_donation(donation_id: str, current_user: dict = Depends(get_current_user)):
    """Get a specific donation"""
    donation = db.get_donation_by_id(donation_id)
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    return donation

@app.post("/api/donations/claim")
async def claim_donation(claim: DonationClaim, current_user: dict = Depends(get_current_user)):
    """Claim a donation (NGO)"""
    if current_user["role"] != "ngo":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only NGOs can claim donations"
        )

    # Get donation
    donation = db.get_donation_by_id(claim.donation_id)
    if not donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )

    if donation["status"] == "Accepted":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Donation already claimed"
        )

    # Update donation status
    updated_donation = db.update_donation(claim.donation_id, {
        "status": "Accepted",
        "claimed_by": current_user["id"],
        "claimed_by_name": current_user.get("organization_name") or current_user.get("name")
    })

    # Get donor details
    donor = db.get_user_by_id(donation["donor_id"])

    # Send acceptance email to donor
    if donor:
        ngo_details = {
            "organization_name": current_user.get("organization_name"),
            "name": current_user.get("name"),
            "email": current_user.get("email"),
            "contact": current_user.get("contact"),
            "address": current_user.get("address")
        }
        email_service.send_acceptance_notification_to_donor(
            donor["email"],
            ngo_details,
            donation
        )

    return {"message": "Donation claimed successfully", "donation": updated_donation}

# Request Endpoints
@app.post("/api/requests", response_model=RequestResponse, status_code=status.HTTP_201_CREATED)
async def create_request(request: RequestCreate, current_user: dict = Depends(get_current_user)):
    """Create a new food request"""
    request_dict = request.model_dump()
    request_dict["requester_id"] = current_user["id"]
    request_dict["requester_name"] = current_user.get("name")

    created_request = db.create_request(request_dict)
    return created_request

@app.get("/api/requests", response_model=List[RequestResponse])
async def get_requests(current_user: dict = Depends(get_current_user)):
    """Get all requests"""
    requests = db.get_all_requests()

    # Non-admin users see only their own requests
    if current_user["role"] != "admin":
        requests = [r for r in requests if r.get("requester_id") == current_user["id"]]

    return requests

# ML Prediction Endpoint
@app.get("/api/predict/categories")
async def get_prediction_categories(current_user: dict = Depends(get_current_user)):
    """Get valid categories for wastage prediction"""
    if current_user["role"] not in ["restaurant", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurants can access this endpoint"
        )

    if ml_service.valid_categories:
        return ml_service.valid_categories
    else:
        return {"error": "Valid categories not available"}

@app.post("/api/predict/wastage", response_model=WastagePredictionResponse)
async def predict_wastage(
    prediction_input: WastagePredictionInput,
    current_user: dict = Depends(get_current_user)
):
    """Predict food wastage"""
    if current_user["role"] not in ["restaurant", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only restaurants can use wastage prediction"
        )

    try:
        result = ml_service.predict_wastage(prediction_input.model_dump())

        return {
            "wastage_percentage": result["wastage_percentage"],
            "wastage_amount": result["wastage_amount"],
            "input_data": prediction_input
        }
    except Exception as e:
        import traceback
        print("=" * 50)
        print("ERROR in wastage prediction endpoint:")
        print(f"Error: {str(e)}")
        traceback.print_exc()
        print("=" * 50)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}"
        )

# Admin Endpoints
@app.get("/api/admin/users", response_model=List[UserResponse])
async def get_all_users(current_user: dict = Depends(get_current_admin)):
    """Get all users (Admin only)"""
    users = db.get_all_users()
    return [{k: v for k, v in user.items() if k != "password"} for user in users]

@app.get("/api/admin/ngos", response_model=List[UserResponse])
async def get_all_ngos(current_user: dict = Depends(get_current_user)):
    """Get all registered NGOs"""
    users = db.get_all_users()
    ngos = [user for user in users if user.get("role") == "ngo"]
    return [{k: v for k, v in ngo.items() if k != "password"} for ngo in ngos]

@app.get("/api/admin/restaurants", response_model=List[UserResponse])
async def get_all_restaurants(current_user: dict = Depends(get_current_user)):
    """Get all registered restaurants"""
    users = db.get_all_users()
    restaurants = [user for user in users if user.get("role") == "restaurant"]
    return [{k: v for k, v in restaurant.items() if k != "password"} for restaurant in restaurants]

@app.put("/api/admin/users/{user_id}")
async def update_user(
    user_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update user (Admin only)"""
    # Don't allow password update through this endpoint
    if "password" in update_data:
        del update_data["password"]

    updated_user = db.update_user(user_id, update_data)
    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return {k: v for k, v in updated_user.items() if k != "password"}

@app.delete("/api/admin/users/{user_id}")
async def delete_user(user_id: str, current_user: dict = Depends(get_current_admin)):
    """Delete user (Admin only)"""
    db.delete_user(user_id)
    return {"message": "User deleted successfully"}

@app.put("/api/admin/donations/{donation_id}")
async def update_donation_admin(
    donation_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_admin)
):
    """Update donation (Admin only)"""
    updated_donation = db.update_donation(donation_id, update_data)
    if not updated_donation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Donation not found"
        )
    return updated_donation

@app.delete("/api/admin/donations/{donation_id}")
async def delete_donation(donation_id: str, current_user: dict = Depends(get_current_admin)):
    """Delete donation (Admin only)"""
    db.delete_donation(donation_id)
    return {"message": "Donation deleted successfully"}

# Image Upload Endpoint
@app.post("/api/upload/image")
async def upload_image(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    """Upload an image"""
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )

    # Generate unique filename
    import uuid
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = os.path.join("uploads", filename)

    # Save file
    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    return {"filename": filename, "url": f"/uploads/{filename}"}

# Health Check
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "Food Waste Management API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
