import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List
import os
from dotenv import load_dotenv

load_dotenv()

class EmailService:
    def __init__(self):
        self.smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
        self.smtp_port = int(os.getenv("SMTP_PORT", "587"))
        self.sender_email = os.getenv("SENDER_EMAIL")
        self.sender_password = os.getenv("SENDER_PASSWORD")

    def send_email(self, to_email: str, subject: str, body: str) -> bool:
        """Send an email"""
        try:
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = to_email
            message["Subject"] = subject

            message.attach(MIMEText(body, "html"))

            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)

            return True
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return False

    def send_donation_notification_to_ngos(self, ngo_emails: List[str], donation_details: dict):
        """Send notification to all NGOs about new donation"""
        subject = "New Food Donation Available"
        body = f"""
        <html>
            <body>
                <h2>New Food Donation Available</h2>
                <p>A new food donation has been listed:</p>
                <ul>
                    <li><strong>Meal Name:</strong> {donation_details.get('meal_name')}</li>
                    <li><strong>Quantity:</strong> {donation_details.get('quantity')}</li>
                    <li><strong>Expiry Date:</strong> {donation_details.get('expiry_date')}</li>
                    <li><strong>Location:</strong> {donation_details.get('address')}</li>
                    <li><strong>Description:</strong> {donation_details.get('description')}</li>
                </ul>
                <p>Please log in to the platform to claim this donation.</p>
            </body>
        </html>
        """

        for email in ngo_emails:
            self.send_email(email, subject, body)

    def send_acceptance_notification_to_donor(self, donor_email: str, ngo_details: dict, donation_details: dict):
        """Send notification to donor when NGO accepts donation"""
        subject = "Your Donation Has Been Accepted"
        body = f"""
        <html>
            <body>
                <h2>Your Donation Has Been Accepted</h2>
                <p>Your food donation has been accepted by an NGO:</p>

                <h3>Donation Details:</h3>
                <ul>
                    <li><strong>Meal Name:</strong> {donation_details.get('meal_name')}</li>
                    <li><strong>Quantity:</strong> {donation_details.get('quantity')}</li>
                </ul>

                <h3>NGO Details:</h3>
                <ul>
                    <li><strong>Organization Name:</strong> {ngo_details.get('organization_name')}</li>
                    <li><strong>Contact Person:</strong> {ngo_details.get('name')}</li>
                    <li><strong>Email:</strong> {ngo_details.get('email')}</li>
                    <li><strong>Contact:</strong> {ngo_details.get('contact')}</li>
                    <li><strong>Address:</strong> {ngo_details.get('address')}</li>
                </ul>

                <p>Thank you for your contribution to reducing food waste!</p>
            </body>
        </html>
        """

        self.send_email(donor_email, subject, body)

email_service = EmailService()
