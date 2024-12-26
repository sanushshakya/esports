import random
from django.conf import settings
from django.utils.decorators import method_decorator
import jwt
from django_ratelimit.decorators import ratelimit
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.db import transaction
from decimal import Decimal
from rest_framework.viewsets import ViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from app.models import CustomUser, OTPVerification, RechargeRequest, Product, Category, Gift, Order, Banner
from app.serializers import RegistrationSerializer, LoginSerializer, UserUpdateSerializer, WalletSerializer, RechargeRequestSerializer, ProductSerializer, CategorySerializer, CategoryWithProductsSerializer, GiftSerializer, OrderSerializer, BannerSerializer
from .utils import send_verification_email
from datetime import datetime, timedelta




class AuthViewSet(ViewSet):
    
    @method_decorator(ratelimit(key="post:email", rate="2/m", block=True))
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def send_otp(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email is already associated with an existing user
        if CustomUser.objects.filter(email=email).exists():
            return Response({"error": "Email is already in use"}, status=status.HTTP_400_BAD_REQUEST)
    
        otp = f"{random.randint(100000, 999999)}" 

        otp_obj, created = OTPVerification.objects.update_or_create(
            email=email, 
            defaults={"otp": otp,
                    "created_at": timezone.now()}
        )

        subject = "Your OTP for Registration"
        message = f"Hello,\n\nYour OTP is: {otp}\n\nThis OTP is valid for 5 minutes.\n\nThank you!"

        # Send the email
        if send_verification_email(email, subject, message):
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send OTP."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @method_decorator(ratelimit(key="post:email", rate="2/m", block=True))
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_otp(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            otp_record = OTPVerification.objects.get(email=email, otp=otp)
            if otp_record.is_expired():
                return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)
            otp_record.delete()
            # Generate a token manually containing the email
            expiration_time = datetime.utcnow() + timedelta(minutes=15)
            token_payload = {"email": email, "exp": expiration_time.timestamp()}
            token = jwt.encode(token_payload, settings.TOKEN_KEY, algorithm="HS256")
            return Response({"message": "OTP verified successfully", "token": token}, status=status.HTTP_200_OK)

        except OTPVerification.DoesNotExist:
            return Response({"error": "Invalid OTP or email"}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is missing"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Decode the token to get the payload
            token_payload = jwt.decode(token, settings.TOKEN_KEY, algorithms=["HS256"])
            verified_email = token_payload.get("email")
            print(verified_email)
            if not verified_email:
                return Response({"error": "Email verification failed"}, status=status.HTTP_400_BAD_REQUEST)

            serializer = RegistrationSerializer(data=request.data)
            if serializer.is_valid():
                # Check for email mismatch
                if serializer.validated_data.get("email") != verified_email:
                    return Response(
                        {"error": "Email mismatch. The provided email does not match the verified email."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                # Save the user if the email matches
                user = serializer.save()
                return Response(
                    {
                        "message": "User registered successfully",
                        "user": {
                            "email": user.email,
                            "username": user.username,
                            "first_name": user.first_name,
                            "last_name": user.last_name,
                            "phone_number": user.phone_number,
                        },
                    },
                    status=status.HTTP_201_CREATED,
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except jwt.ExpiredSignatureError:
            return Response({"error": "Token has expired"}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.DecodeError:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def login(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data.get("user")

            if not user:
                return Response({"error": "User authentication failed."}, status=status.HTTP_404_NOT_FOUND)

            try:
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)  
                refresh_token = str(refresh)           
                return Response({
                    "message": "User logged in successfully.",
                    "email": user.email,
                    "user_id": user.id,
                    "access_token": access_token,
                    "refresh_token": refresh_token
                }, status=status.HTTP_200_OK)

            except Exception as token_error:
                return Response({"error": f"Token creation error: {str(token_error)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def profile(self, request):
        user = request.user
        return Response(
            {
                "email": user.email,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone_number": user.phone_number,
            },
            status=status.HTTP_200_OK,
        )
        
    @action(detail=False, methods=["put"], permission_classes=[IsAuthenticated])
    def update_user(self, request):
        user = request.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User information updated successfully",
                "username": user.username,
                "email":user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "phone_number": user.phone_number,}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @method_decorator(ratelimit(key="post:email", rate="2/m", block=True))
    @action(detail=False, methods=["delete"], permission_classes=[IsAuthenticated])
    def delete_account(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Account deleted successfully."}, status=status.HTTP_200_OK)
    
    @method_decorator(ratelimit(key="post:email", rate="1/m", block=True))
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def forget_password(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        if not CustomUser.objects.filter(email=email).exists():
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)

        otp = f"{random.randint(100000, 999999)}"
        otp_obj, created = OTPVerification.objects.update_or_create(
            email=email,
            defaults={"otp": otp, "created_at": timezone.now()}
        )
        subject = "Your Password Reset OTP"
        message = f"Hello,\n\nYour OTP is: {otp}\n\nThis OTP is valid for 5 minutes.\n\nThank you!"

        if send_verification_email(email, subject, message):
            return Response({"message": "OTP sent successfully."}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Failed to send OTP."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @method_decorator(ratelimit(key="post:email", rate="3/m", block=True))    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def verify_forget_password_otp(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")
        if not email or not otp:
            return Response({"error": "Email and OTP are required."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            otp_record = OTPVerification.objects.get(email=email, otp=otp)
            if otp_record.is_expired():
                return Response({"error": "OTP has expired."}, status=status.HTTP_400_BAD_REQUEST)
            expiration_time = datetime.utcnow() + timedelta(minutes=15)
            token_payload = {"email": email, "exp": expiration_time.timestamp()}
            token = jwt.encode(token_payload, settings.TOKEN_KEY, algorithm="HS256")
            otp_record.delete() 
            return Response({"message": "OTP verified successfully.", "token": token}, status=status.HTTP_200_OK)

        except OTPVerification.DoesNotExist:
            return Response({"error": "Invalid OTP or email."}, status=status.HTTP_400_BAD_REQUEST)
    
    # @method_decorator(ratelimit(key="post:email", rate="1/m", block=True))    
    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def reset_password(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"error": "Token is missing"}, status=status.HTTP_400_BAD_REQUEST)
        token_payload = jwt.decode(token, settings.TOKEN_KEY, algorithms=["HS256"])
        verified_email = token_payload.get("email")
        if not verified_email:
                return Response({"error": "Email verification failed"}, status=status.HTTP_400_BAD_REQUEST)

        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        if not new_password or not confirm_password:
            return Response({"error": "Both new password and confirmation are required."}, status=status.HTTP_400_BAD_REQUEST)
        if new_password != confirm_password:
            return Response({"error": "Passwords do not match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(email=verified_email)
            user.password = make_password(new_password)
            user.save()
            request.session.pop("reset_email", None)

            return Response({"message": "Password reset successfully."}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
class WalletViewSet(ViewSet):
    
    @method_decorator(ratelimit(key="post:email", rate="1/m", block=True))    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def request_recharge(self, request):
        serializer = RechargeRequestSerializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            amount = serializer.validated_data['amount']
            external_payment_id = serializer.validated_data['external_payment_id']

            if amount < 500:
                return Response({"error": "Amount must be greater than 500"}, status=status.HTTP_400_BAD_REQUEST)
            
            RechargeRequest.objects.create(
            user=request.user,
            amount=amount,
            external_payment_id=external_payment_id,
            status='PENDING'  
            )
            return Response({"message": "Recharge request submitted successfully"}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @method_decorator(ratelimit(key="post:email", rate="1/m", block=True))    
    # @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    # def approve_recharge(self, request):
    #     if not request.user.is_staff:
    #         return Response({"error": "Admin privileges required"}, status=status.HTTP_403_FORBIDDEN)

    #     request_id = request.data.get('request_id')

    #     try:
    #         recharge_request = RechargeRequest.objects.get(id=request_id, status='PENDING')
    #         recharge_request.status = 'APPROVED'
    #         recharge_request.save()

    #         wallet = recharge_request.user.wallet
    #         wallet.balance += recharge_request.amount
    #         wallet.save()

    #         return Response({"message": f"Recharge request approved for {recharge_request.user.email}"}, status=status.HTTP_200_OK)

    #     except RechargeRequest.DoesNotExist:
    #         return Response({"error": "Recharge request not found or already processed"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def get_balance(self, request):
        wallet = request.user.wallet
        serializer = WalletSerializer(wallet)
        return Response({"balance": serializer.data['balance']}, status=status.HTTP_200_OK)

    @method_decorator(ratelimit(key="post:email", rate="1/m", block=True))    
    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def purchase_product(self, request):
        product_price = request.data.get('price')

        if not product_price:
            return Response({"error": "Product price is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            product_price = Decimal(str(product_price))

            if product_price <= 0:
                return Response({"error": "Price must be greater than zero"}, status=status.HTTP_400_BAD_REQUEST)

            wallet = request.user.wallet

            if wallet.balance < product_price:
                return Response({"error": "Insufficient balance"}, status=status.HTTP_400_BAD_REQUEST)

            # Deduct the amount from the wallet
            with transaction.atomic():
                wallet.balance -= product_price
                wallet.save()

                return Response({"message": f"Product purchased successfully. New balance: {wallet.balance}"}, status=status.HTTP_200_OK)

        except ValueError:
            return Response({"error": "Invalid price value"}, status=status.HTTP_400_BAD_REQUEST)
        except wallet.DoesNotExist:
            return Response({"error": "Wallet not found"}, status=status.HTTP_404_NOT_FOUND)
        
class ProductViewSet(ViewSet):
    @action(detail=True, methods=["get"], permission_classes=[AllowAny])
    def view_product(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
            serializer = ProductSerializer(product)
            return Response(serializer.data)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=404)

    @method_decorator(ratelimit(key="post:email", rate="1/m", block=True))   
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def buy_product(self, request, pk):
        try:
            product = Product.objects.get(pk=pk)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        wallet = request.user.wallet
        if wallet.balance < product.price:
            return Response({"error": "Insufficient wallet balance"}, status=status.HTTP_400_BAD_REQUEST)

        voucher_code = None

        if product.has_gift:
            gift = Gift.objects.filter(product=product, used=False).first()

            if not gift:
                return Response({"error": "No available gifts for this product"}, status=status.HTTP_400_BAD_REQUEST)

            gift.used = True
            gift.save()
            
            subject = f"Redeem Code of {product.title} "
            message = (
                f"Hello {request.user.username},\n\n"
                f"Thank you for your purchase of {product.title}.\n"
                f"Here is your gift code: {gift.code}\n\n"
                "Enjoy your gift!\n\nThank you!"
            )

            if not send_verification_email(request.user.email, subject, message):
                return Response({"error": "Purchase successful, but email sending failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            voucher_code = gift.code
        else:
            subject = f"Successful Purchase of {product.title} "
            message = (
                f"Hello {request.user.username},\n\n"
                f"Thank you for your purchase of {product.title}.\n"
            )

            if not send_verification_email(request.user.email, subject, message):
                return Response({"error": "Purchase successful, but email sending failed."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            
        wallet.balance -= product.price
        wallet.save()
            
        Order.objects.create(
            user=request.user,
            product=product,
            price=product.price,
            voucher_code=voucher_code,
            remaining_balance=wallet.balance,
        )
        return Response({"message": "Purchase successful. Gift code sent to your email."}, status=status.HTTP_200_OK)
    
class CategoryViewSet(ViewSet):
    permission_classes = [AllowAny]
    @action(detail=False, methods=["get"])
    def get_categories_with_products(self, request):
        categories = Category.objects.prefetch_related('products').all()
        serializer = CategoryWithProductsSerializer(categories, many=True)
        return Response(serializer.data)
    
class BannerViewSet(ViewSet):
    permission_classes = [AllowAny]
    @action(detail=False, methods=["get"])
    def get_banners(self, request):
        banners = Banner.objects.filter(active=True)
        serializer = BannerSerializer(banners, many=True)
        return Response(serializer.data)