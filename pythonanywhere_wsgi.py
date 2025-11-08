# +++++++++++ DJANGO +++++++++++
# PythonAnywhere uchun WSGI konfiguratsiya fayli
# Bu faylni PythonAnywhere Web tab da WSGI configuration file ga ko'chirib qo'ying

import os
import sys

# ============================================
# 1. LOYIHA YO'LINI QO'SHISH
# ============================================
# PythonAnywhere dagi loyihangiz yo'lini kiriting
path = '/home/delux/online-dokon'
if path not in sys.path:
    sys.path.insert(0, path)

# ============================================
# 2. VIRTUAL ENVIRONMENT NI FAOLLASHTIRISH
# ============================================
# Virtual environment yo'lini kiriting
# Masalan: /home/delux/.virtualenvs/myenv
# MUHIM: Bu qatorni o'z virtual environment yo'lingizga o'zgartiring!
# activate_this = '/home/delux/.virtualenvs/myenv/bin/activate_this.py'
# with open(activate_this) as file_:
#     exec(file_.read(), dict(__file__=activate_this))

# ============================================
# 3. DJANGO SETTINGS MODULE NI BELGILASH
# ============================================
os.environ['DJANGO_SETTINGS_MODULE'] = 'setting.settings'

# ============================================
# 4. DJANGO WSGI APPLICATION NI YUKLASH
# ============================================
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
