"""
Email verification utilities
Gmail orqali tasdiqlash kodini yuborish
"""

import random
import string
from django.core.mail import send_mail
from django.conf import settings

def generate_verification_code():
    """6 xonali tasdiqlash kodini generatsiya qilish"""
    return ''.join(random.choices(string.digits, k=6))

def send_verification_email(user_email, verification_code):
    """
    Foydalanuvchiga tasdiqlash kodini yuborish
    
    Gmail SMTP sozlamalari settings.py da bo'lishi kerak:
    EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
    EMAIL_HOST = 'smtp.gmail.com'
    EMAIL_PORT = 587
    EMAIL_USE_TLS = True
    EMAIL_HOST_USER = 'your-email@gmail.com'
    EMAIL_HOST_PASSWORD = 'your-app-password'
    """
    
    subject = 'Mercedes-Benz - Email Tasdiqlash'
    message = f"""
    Assalomu alaykum!
    
    Mercedes-Benz online do'koniga xush kelibsiz!
    
    Sizning tasdiqlash kodingiz: {verification_code}
    
    Ushbu kodni profilingizda kiriting.
    
    Agar siz bu so'rovni yubormaganingiz bo'lsa, ushbu xabarni e'tiborsiz qoldiring.
    
    Hurmat bilan,
    Mercedes-Benz jamoasi
    """
    
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; text-align: center;">Mercedes-Benz</h2>
            <h3 style="color: #333;">Email Tasdiqlash</h3>
            <p style="color: #666; line-height: 1.6;">Assalomu alaykum!</p>
            <p style="color: #666; line-height: 1.6;">Mercedes-Benz online do'koniga xush kelibsiz!</p>
            
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <p style="color: white; margin: 0; font-size: 14px;">Sizning tasdiqlash kodingiz:</p>
                <h1 style="color: white; margin: 10px 0; font-size: 36px; letter-spacing: 8px;">{verification_code}</h1>
            </div>
            
            <p style="color: #666; line-height: 1.6;">Ushbu kodni profilingizda kiriting.</p>
            <p style="color: #999; font-size: 12px; margin-top: 30px;">Agar siz bu so'rovni yubormaganingiz bo'lsa, ushbu xabarni e'tiborsiz qoldiring.</p>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2025 Mercedes-Benz. Barcha huquqlar himoyalangan.</p>
        </div>
    </body>
    </html>
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Email yuborishda xatolik: {e}")
        return False

def send_order_confirmation_email(user_email, order):
    """Buyurtma tasdiqlanganini xabar qilish"""
    subject = f'Buyurtma #{order.id} tasdiqlandi'
    message = f"""
    Hurmatli {order.first_name} {order.last_name}!
    
    Sizning buyurtmangiz muvaffaqiyatli qabul qilindi.
    
    Buyurtma raqami: #{order.id}
    Jami summa: ${order.total_amount}
    Holat: {order.get_status_display()}
    
    Tez orada siz bilan bog'lanamiz.
    
    Rahmat!
    Mercedes-Benz jamoasi
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [user_email],
            fail_silently=False,
        )
        return True
    except:
        return False
