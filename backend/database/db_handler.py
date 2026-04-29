import json
import os
from typing import List, Dict, Any, Optional
from datetime import datetime

class JSONDatabase:
    def __init__(self, base_path: str = "database"):
        self.base_path = base_path
        os.makedirs(base_path, exist_ok=True)
        self.auth_file = os.path.join(base_path, "auth.json")
        self.data_file = os.path.join(base_path, "data.json")
        self._initialize_files()

    def _initialize_files(self):
        """Initialize JSON files if they don't exist"""
        if not os.path.exists(self.auth_file):
            initial_auth = {
                "users": []
            }
            self._write_json(self.auth_file, initial_auth)

        if not os.path.exists(self.data_file):
            initial_data = {
                "donations": [],
                "requests": [],
                "ngos": [],
                "restaurants": []
            }
            self._write_json(self.data_file, initial_data)

    def _read_json(self, filepath: str) -> Dict:
        """Read JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _write_json(self, filepath: str, data: Dict):
        """Write to JSON file"""
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)

    # User Management
    def create_user(self, user_data: Dict) -> Dict:
        """Create a new user"""
        auth_data = self._read_json(self.auth_file)
        user_data["id"] = str(len(auth_data["users"]) + 1)
        user_data["created_at"] = datetime.now().isoformat()
        auth_data["users"].append(user_data)
        self._write_json(self.auth_file, auth_data)
        return user_data

    def get_user_by_email(self, email: str) -> Optional[Dict]:
        """Get user by email"""
        auth_data = self._read_json(self.auth_file)
        for user in auth_data["users"]:
            if user["email"] == email:
                return user
        return None

    def get_user_by_id(self, user_id: str) -> Optional[Dict]:
        """Get user by ID"""
        auth_data = self._read_json(self.auth_file)
        for user in auth_data["users"]:
            if user["id"] == user_id:
                return user
        return None

    def get_all_users(self) -> List[Dict]:
        """Get all users"""
        auth_data = self._read_json(self.auth_file)
        return auth_data.get("users", [])

    def update_user(self, user_id: str, update_data: Dict) -> Optional[Dict]:
        """Update user data"""
        auth_data = self._read_json(self.auth_file)
        for i, user in enumerate(auth_data["users"]):
            if user["id"] == user_id:
                auth_data["users"][i].update(update_data)
                self._write_json(self.auth_file, auth_data)
                return auth_data["users"][i]
        return None

    def delete_user(self, user_id: str) -> bool:
        """Delete a user"""
        auth_data = self._read_json(self.auth_file)
        auth_data["users"] = [u for u in auth_data["users"] if u["id"] != user_id]
        self._write_json(self.auth_file, auth_data)
        return True

    # Donation Management
    def create_donation(self, donation_data: Dict) -> Dict:
        """Create a new donation"""
        data = self._read_json(self.data_file)
        donation_data["id"] = str(len(data["donations"]) + 1)
        donation_data["created_at"] = datetime.now().isoformat()
        donation_data["status"] = "Pending"
        data["donations"].append(donation_data)
        self._write_json(self.data_file, data)
        return donation_data

    def get_all_donations(self) -> List[Dict]:
        """Get all donations"""
        data = self._read_json(self.data_file)
        return data.get("donations", [])

    def get_donation_by_id(self, donation_id: str) -> Optional[Dict]:
        """Get donation by ID"""
        data = self._read_json(self.data_file)
        for donation in data["donations"]:
            if donation["id"] == donation_id:
                return donation
        return None

    def update_donation(self, donation_id: str, update_data: Dict) -> Optional[Dict]:
        """Update donation data"""
        data = self._read_json(self.data_file)
        for i, donation in enumerate(data["donations"]):
            if donation["id"] == donation_id:
                data["donations"][i].update(update_data)
                data["donations"][i]["updated_at"] = datetime.now().isoformat()
                self._write_json(self.data_file, data)
                return data["donations"][i]
        return None

    def delete_donation(self, donation_id: str) -> bool:
        """Delete a donation"""
        data = self._read_json(self.data_file)
        data["donations"] = [d for d in data["donations"] if d["id"] != donation_id]
        self._write_json(self.data_file, data)
        return True

    # Request Management
    def create_request(self, request_data: Dict) -> Dict:
        """Create a new request"""
        data = self._read_json(self.data_file)
        request_data["id"] = str(len(data["requests"]) + 1)
        request_data["created_at"] = datetime.now().isoformat()
        request_data["status"] = "Pending"
        data["requests"].append(request_data)
        self._write_json(self.data_file, data)
        return request_data

    def get_all_requests(self) -> List[Dict]:
        """Get all requests"""
        data = self._read_json(self.data_file)
        return data.get("requests", [])

    def get_request_by_id(self, request_id: str) -> Optional[Dict]:
        """Get request by ID"""
        data = self._read_json(self.data_file)
        for request in data["requests"]:
            if request["id"] == request_id:
                return request
        return None

    def update_request(self, request_id: str, update_data: Dict) -> Optional[Dict]:
        """Update request data"""
        data = self._read_json(self.data_file)
        for i, request in enumerate(data["requests"]):
            if request["id"] == request_id:
                data["requests"][i].update(update_data)
                data["requests"][i]["updated_at"] = datetime.now().isoformat()
                self._write_json(self.data_file, data)
                return data["requests"][i]
        return None

    def delete_request(self, request_id: str) -> bool:
        """Delete a request"""
        data = self._read_json(self.data_file)
        data["requests"] = [r for r in data["requests"] if r["id"] != request_id]
        self._write_json(self.data_file, data)
        return True

# Singleton instance
db = JSONDatabase()
