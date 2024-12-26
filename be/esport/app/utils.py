from django.core.mail import send_mail

def send_verification_email(email, subject, message):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=[email],
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False
    
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    """
    Custom exception handler that modifies the default DRF exception responses.
    """
    response = exception_handler(exc, context)

    if response is not None:
        response.data['status_code'] = response.status_code

    return response