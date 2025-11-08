
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Category(models.Model):
    name = models.CharField(max_length=100, verbose_name="Kategoriya nomi")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    image = models.ImageField(upload_to='categories/', blank=True, null=True, verbose_name="Rasm")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Kategoriya"
        verbose_name_plural = "Kategoriyalar"
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200, verbose_name="Mahsulot nomi")
    description = models.TextField(verbose_name="Tavsif")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Narx")
    discount_percent = models.PositiveIntegerField(default=0, validators=[MinValueValidator(0), MaxValueValidator(90)], verbose_name="Skidka (%)")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products', verbose_name="Kategoriya")
    image = models.ImageField(upload_to='products/', blank=True, null=True, verbose_name="Asosiy rasm")
    stock = models.PositiveIntegerField(default=0, verbose_name="Ombordagi miqdor")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    is_featured = models.BooleanField(default=False, verbose_name="Tavsiya etiladi")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Mahsulot"
        verbose_name_plural = "Mahsulotlar"
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

    @property
    def has_discount(self):
        return (self.discount_percent or 0) > 0

    @property
    def discounted_price(self):
        if self.has_discount:
            return self.price * (100 - self.discount_percent) / 100
        return self.price

class ProductImage(models.Model):
    """Mahsulot uchun qo'shimcha rasmlar"""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images', verbose_name="Mahsulot")
    image = models.ImageField(upload_to='products/gallery/', verbose_name="Rasm")
    order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Mahsulot rasmi"
        verbose_name_plural = "Mahsulot rasmlari"
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.product.name} - Rasm {self.order}"

class Cart(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=100, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Savatcha"
        verbose_name_plural = "Savatchalar"
    
    def __str__(self):
        if self.user:
            return f"Savatcha - {self.user.username}"
        return f"Savatcha - {self.session_key}"

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Savatcha elementi"
        verbose_name_plural = "Savatcha elementlari"
        unique_together = ['cart', 'product']
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def total_price(self):
        # Use discounted price if available
        return self.product.discounted_price * self.quantity

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('processing', 'Jarayonda'),
        ('shipped', 'Yuborilgan'),
        ('delivered', 'Yetkazilgan'),
        ('cancelled', 'Bekor qilingan'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    session_key = models.CharField(max_length=100, null=True, blank=True)
    first_name = models.CharField(max_length=100, verbose_name="Ism")
    last_name = models.CharField(max_length=100, verbose_name="Familiya")
    email = models.EmailField(verbose_name="Email")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    address = models.TextField(verbose_name="Manzil")
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Jami summa")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending', verbose_name="Holat")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Buyurtma #{self.id} - {self.first_name} {self.last_name}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = "Buyurtma elementi"
        verbose_name_plural = "Buyurtma elementlari"
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    @property
    def total_price(self):
        return self.price * self.quantity

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Sharh"
        verbose_name_plural = "Sharhlar"
        unique_together = ('product', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} - {self.user.username} ({self.rating})"


class ContactMessage(models.Model):
    """Foydalanuvchilardan kelgan murojaatlar (contact form)"""
    name = models.CharField(max_length=150)
    email = models.EmailField()
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Kontakt xabar"
        verbose_name_plural = "Kontakt xabarlar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} <{self.email}> - {self.created_at:%Y-%m-%d %H:%M}"


class Address(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(max_length=100, blank=True, help_text='Masalan: Uy, Ish')
    full_name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    line1 = models.CharField(max_length=255)
    line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='Oʻzbekiston')
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Manzil"
        verbose_name_plural = "Manzillar"
        ordering = ['-is_default', '-created_at']

    def __str__(self):
        return f"{self.title or self.line1} ({self.user.username})"


class Wishlist(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='wishlist')
    products = models.ManyToManyField(Product, blank=True, related_name='wishlisted_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Wishlist'
        verbose_name_plural = 'Wishlists'

    def __str__(self):
        return f"Wishlist - {self.user.username}"


class UserProfile(models.Model):
    """Foydalanuvchi profili - to'liq ma'lumotlar"""
    
    # O'zbekiston viloyatlari
    REGIONS = [
        ('tashkent_city', 'Toshkent shahri'),
        ('tashkent', 'Toshkent viloyati'),
        ('andijan', 'Andijon'),
        ('bukhara', 'Buxoro'),
        ('fergana', 'Farg\'ona'),
        ('jizzakh', 'Jizzax'),
        ('namangan', 'Namangan'),
        ('navoi', 'Navoiy'),
        ('kashkadarya', 'Qashqadaryo'),
        ('samarkand', 'Samarqand'),
        ('sirdarya', 'Sirdaryo'),
        ('surkhandarya', 'Surxondaryo'),
        ('karakalpakstan', 'Qoraqalpog\'iston'),
    ]
    
    GENDER_CHOICES = [
        ('male', 'Erkak'),
        ('female', 'Ayol'),
        ('other', 'Boshqa'),
    ]
    
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE, related_name='profile')
    
    # Shaxsiy ma'lumotlar
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True, verbose_name='Avatar')
    bio = models.TextField(blank=True, verbose_name='Bio')
    phone = models.CharField(max_length=30, blank=True, verbose_name='Telefon')
    date_of_birth = models.DateField(blank=True, null=True, verbose_name='Tug\'ilgan sana')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True, verbose_name='Jins')
    
    # Manzil ma'lumotlari
    region = models.CharField(max_length=50, choices=REGIONS, blank=True, verbose_name='Viloyat')
    city = models.CharField(max_length=100, blank=True, verbose_name='Shahar/Tuman')
    address = models.TextField(blank=True, verbose_name='To\'liq manzil')
    postal_code = models.CharField(max_length=20, blank=True, verbose_name='Pochta indeksi')
    
    # Qo'shimcha ma'lumotlar
    telegram_username = models.CharField(max_length=100, blank=True, verbose_name='Telegram')
    whatsapp_number = models.CharField(max_length=30, blank=True, verbose_name='WhatsApp')
    
    # Email tasdiqlash
    email_verified = models.BooleanField(default=False, verbose_name='Email tasdiqlangan')
    email_verification_code = models.CharField(max_length=6, blank=True, verbose_name='Tasdiqlash kodi')
    
    # Statistika
    total_orders = models.PositiveIntegerField(default=0, verbose_name='Jami buyurtmalar')
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name='Jami xarajat')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Foydalanuvchi profili'
        verbose_name_plural = 'Foydalanuvchi profillari'

    def __str__(self):
        return f"{self.user.username} - {self.get_region_display() or 'Manzil kiritilmagan'}"
    
    def get_full_address(self):
        """To'liq manzilni qaytarish"""
        parts = []
        if self.address:
            parts.append(self.address)
        if self.city:
            parts.append(self.city)
        if self.region:
            parts.append(self.get_region_display())
        return ', '.join(parts) if parts else 'Manzil kiritilmagan'