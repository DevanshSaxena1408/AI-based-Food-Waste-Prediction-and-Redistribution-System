from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal
from datetime import datetime

# User Models
class UserBase(BaseModel):
    name: str
    email: EmailStr
    contact: str
    address: str
    latitude: float
    longitude: float

class UserRegister(UserBase):
    password: str = Field(..., min_length=6, max_length=72)
    role: Literal["restaurant", "ngo", "admin"]

    # Restaurant specific fields
    restaurant_name: Optional[str] = None
    license_number: Optional[str] = None

    # NGO specific fields
    organization_name: Optional[str] = None
    certification: Optional[str] = None
    people_served: Optional[int] = None
    description: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    role: str
    created_at: str
    restaurant_name: Optional[str] = None
    license_number: Optional[str] = None
    organization_name: Optional[str] = None
    certification: Optional[str] = None
    people_served: Optional[int] = None
    description: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Donation Models
class DonationCreate(BaseModel):
    meal_name: str
    quantity: str
    image: Optional[str] = None
    packaging_type: str
    expiry_date: str
    reason: str
    description: str
    address: str
    latitude: float
    longitude: float
    donor_id: str

class DonationResponse(DonationCreate):
    id: str
    status: Literal["Pending", "Accepted"]
    created_at: str
    updated_at: Optional[str] = None
    claimed_by: Optional[str] = None
    claimed_by_name: Optional[str] = None

    donor_name: Optional[str] = None
    donor_email: Optional[str] = None
    donor_contact: Optional[str] = None

class DonationClaim(BaseModel):
    donation_id: str
    ngo_id: str

# Request Models
class RequestCreate(BaseModel):
    meal_type: str
    quantity: str
    delivery_address: str
    latitude: float
    longitude: float
    requester_id: str
    description: Optional[str] = None

class RequestResponse(RequestCreate):
    id: str
    status: Literal["Pending", "Fulfilled"]
    created_at: str
    updated_at: Optional[str] = None

# Wastage Prediction Models
class WastagePredictionInput(BaseModel):
    type_of_food: str
    number_of_guests: int
    event_type: str
    quantity: float
    storage_conditions: str
    purchase_history: str
    seasonality: str
    preparation_method: str
    geographical_location: str
    pricing: float

class WastagePredictionResponse(BaseModel):
    wastage_percentage: float
    wastage_amount: float
    input_data: WastagePredictionInput
