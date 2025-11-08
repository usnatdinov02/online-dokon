# Production Settings for PythonAnywhere
# Bu faylni production da ishlatish uchun DJANGO_SETTINGS_MODULE ni o'zgartiring

from .settings import *
import os

# ============================================
# PRODUCTION SOZLAMALARI
# ============================================

# DEBUG ni o'chirish (MUHIM!)
DEBUG = False

# ALLOWED_HOSTS ni aniq ko'rsatish
ALLOWED_HOSTS = [
    'delux.pythonanywhere.com',
    'www.delux.pythonanywhere.com',
]

# SECRET_KEY ni environment variable dan olish (xavfsizlik uchun)
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-test-key-for-development-only')

# ============================================
# STATIC VA MEDIA FAYLLAR
# ============================================
STATIC_ROOT = '/home/delux/online-dokon/staticfiles'
MEDIA_ROOT = '/home/delux/online-dokon/media'

# ============================================
# XAVFSIZLIK SOZLAMALARI
# ============================================
# HTTPS uchun (agar SSL sertifikat bo'lsa)
SECURE_SSL_REDIRECT = False  # SSL bo'lsa True qiling
SESSION_COOKIE_SECURE = False  # SSL bo'lsa True qiling
CSRF_COOKIE_SECURE = False  # SSL bo'lsa True qiling

# Security headers
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True

# ============================================
# DATABASE (agar MySQL ishlatmoqchi bo'lsangiz)
# ============================================
# PythonAnywhere MySQL database
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'delux$default',
#         'USER': 'delux',
#         'PASSWORD': os.environ.get('DB_PASSWORD', ''),
#         'HOST': 'delux.mysql.pythonanywhere-services.com',
#         'OPTIONS': {
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
#         },
#     }
# }

# SQLite ishlatayotgan bo'lsangiz (default)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# ============================================
# EMAIL SOZLAMALARI (Production)
# ============================================
# Gmail SMTP
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER

# ============================================
# LOGGING (Xatolarni kuzatish uchun)
# ============================================
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/home/delux/online-dokon/django_errors.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# ============================================
# CACHE SOZLAMALARI
# ============================================
# Production da caching yaxshilaydi
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'TIMEOUT': 300,
        'OPTIONS': {
            'MAX_ENTRIES': 1000
        }
    }
}
