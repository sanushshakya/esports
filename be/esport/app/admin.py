from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import CustomUser, OTPVerification, Wallet, RechargeRequest, Category, Product, Gift, Order, Banner

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    model = CustomUser

    # Display user details in the list view
    list_display = ('email', 'username', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active')
    search_fields = ('email', 'username', 'first_name', 'last_name')

    # Define form field sections
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('date_joined',)}),  # Display but non-editable
    )

    readonly_fields = ('date_joined',)  # Makes 'date_joined' read-only
    
@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('email', 'otp', 'created_at')
    search_fields = ('email', 'otp')
    list_filter = ('created_at',)
    
# Register Wallet model
@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ('user__email',)
    list_filter = ('balance',)
    readonly_fields = ('balance',)
    ordering = ['balance']

# Register RechargeRequest model
@admin.register(RechargeRequest)
class RechargeRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'status', 'external_payment_id', 'created_at')
    search_fields = ('user__email', 'amount')
    list_filter = ('status', 'created_at')
    readonly_fields = ('created_at',)

    def save_model(self, request, obj, form, change):
        if change:
            original_obj = RechargeRequest.objects.get(pk=obj.pk)

            # Prevent changes if the status is already approved
            if original_obj.status == 'APPROVED' and obj.status != original_obj.status:
                self.message_user(request, "Approved requests cannot be modified.")
                return  # Abort saving changes

            if obj.status == 'APPROVED' and original_obj.status != 'APPROVED':
                # If status changes to 'APPROVED', update the user's wallet balance
                wallet = Wallet.objects.get(user=obj.user)
                wallet.balance += obj.amount
                wallet.save()
                self.message_user(request, f"Recharge request approved for {obj.user.email}")

        obj.save()
        
class ProductInline(admin.TabularInline):
    model = Product
    extra = 0
    fields = ('title', 'price', 'has_gift')
    readonly_fields = ('title', 'price', 'has_gift')
    
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    inlines = [ProductInline]
    
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'price', 'has_gift', 'image_preview')
    list_filter = ('category', 'has_gift')
    search_fields = ('title', 'category__name')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    def image_preview(self, obj):
        if obj.image_url and obj.image_url.url:  # Check if the image exists
            return format_html('<img src="{}" style="width: 100px; height: auto;" />', obj.image_url.url)
        return "No Image"

    image_preview.short_description = "Image"
   
@admin.register(Gift)
class GiftAdmin(admin.ModelAdmin):
    list_display = ('product', 'code', 'used', 'created_at')
    list_filter = ('used', 'product__category')
    search_fields = ('product__title', 'code')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)
    
    def save_model(self, request, obj, form, change):
        if change:
            original = Gift.objects.get(pk=obj.pk)
            if original.used and not obj.used:
                self.message_user(request, "Cannot mark a used gift back to unused.", level="error")
                return
        obj.save()

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'price', 'remaining_balance', 'created_at')
    list_filter = ('product__category', 'created_at')
    search_fields = ('user__email', 'product__title')
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'voucher_code')
    
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'active', 'created_at', 'image_preview')
    list_filter = ('active',)
    search_fields = ('title',)
    readonly_fields = ('created_at',)
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 100px; height: auto;" />', obj.image.url)
        return "No Image"

    image_preview.short_description = "Image Preview"