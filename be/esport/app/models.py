from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.conf import settings
from django.templatetags.static import static
from django.core.exceptions import ValidationError

class CustomUserManager(BaseUserManager):
    def create_user(self, email, username, first_name, last_name, phone_number, password=None):
        if not email:
            raise ValueError("Email address is required")
        if not username:
            raise ValueError("Username is required")
        
        email = self.normalize_email(email)
        user = self.model(
            email=email, 
            username=username, 
            first_name=first_name, 
            last_name=last_name, 
            phone_number=phone_number
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, first_name, last_name, phone_number, password=None):
        user = self.create_user(email, username, first_name, last_name, phone_number, password)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class CustomUser(AbstractBaseUser, PermissionsMixin):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    phone_number = models.CharField(max_length=15)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    groups = models.ManyToManyField(
        Group,
        related_name='customuser_groups',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_permissions',
        blank=True
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name', 'phone_number']

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Return the user's full name."""
        return f"{self.first_name} {self.last_name}"
    
class OTPVerification(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        from datetime import timedelta
        from django.utils.timezone import now
        return self.created_at < now() - timedelta(minutes=5)
    
class Wallet(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wallet')
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.user.email}'s Wallet Balance: {self.balance}"

class RechargeRequest(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    external_payment_id = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} requested {self.amount} - Status: {self.status}"
    
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

class Product(models.Model):
    category = models.ForeignKey(Category, related_name='products', on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    overview = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    details_html = models.TextField(blank=True, null=True)
    faqs = models.JSONField(default=list, blank=True, null=True)
    has_gift = models.BooleanField(default=False)
    image_url = models.ImageField(upload_to='product_images/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.title
    
    @property
    def image_url_https(self):
        if self.image_url:
            url = f"{settings.MEDIA_URL}{self.image_url}"
            return url.replace("http://", "https://") if settings.DEBUG else url
        return None
    
    def clean(self):
        super().clean() 
        if self.image_url and self.image_url.size > 4 * 1024 * 1024:  # 4 MB limit
            raise ValidationError("Image size cannot exceed 4 MB.")

    def save(self, *args, **kwargs):
        self.full_clean() 
        super().save(*args, **kwargs)
    
    
class Gift(models.Model):
    product = models.ForeignKey(Product, related_name='gifts', on_delete=models.CASCADE)
    code = models.CharField(max_length=100, unique=True)
    used = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True) 
    
    def save(self, *args, **kwargs):
        if self.pk:
            old_gift = Gift.objects.get(pk=self.pk)
            if old_gift.used and not self.used:
                raise ValueError("Cannot mark a used gift back to unused")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Gift for {self.product.title} - {self.code}"
    
class Order(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders")
    product = models.ForeignKey('Product', on_delete=models.CASCADE, related_name="orders")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    voucher_code = models.CharField(max_length=100, blank=True, null=True)
    remaining_balance = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} - {self.user.email} - {self.product.title}"
    
class Banner(models.Model):
    image = models.ImageField(upload_to='banners/', blank=True, null=True) 
    title = models.CharField(max_length=255, blank=True, null=True) 
    description = models.TextField(blank=True, null=True)  
    created_at = models.DateTimeField(auto_now_add=True)  
    active = models.BooleanField(default=True) 

    def __str__(self):
        return self.title or f"Banner {self.id}"
    
    @property
    def image_url(self):
        """Returns the image URL for the banner."""
        if self.image:
            return self.image.url
        return None