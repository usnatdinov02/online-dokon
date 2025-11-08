# 🚀 PythonAnywhere Deploy - Qisqa Qo'llanma

**Username:** delux  
**GitHub:** https://github.com/usnatdinov02/online-dokon  
**Sayt:** https://delux.pythonanywhere.com

---

## 📋 DEPLOY QADAMLARI

### 1️⃣ PythonAnywhere Bash Console

```bash
# Home directory ga o'tish
cd ~

# GitHub dan clone qilish
git clone https://github.com/usnatdinov02/online-dokon.git

# Loyiha papkasiga o'tish
cd online-dokon
```

---

### 2️⃣ Virtual Environment

```bash
# Virtual environment yaratish
mkvirtualenv --python=/usr/bin/python3.10 myenv

# Faollashtirish
workon myenv

# Requirements o'rnatish
pip install -r requirements.txt
```

---

### 3️⃣ WSGI Configuration

1. **Web** tabiga o'ting
2. **WSGI configuration file** ni oching
3. **Hamma narsani o'chiring** va quyidagi kodni qo'ying:

```python
# +++++++++++ DJANGO +++++++++++
import os
import sys

# Loyiha yo'li
path = '/home/delux/online-dokon'
if path not in sys.path:
    sys.path.insert(0, path)

# Django settings
os.environ['DJANGO_SETTINGS_MODULE'] = 'setting.settings'

# WSGI application
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

4. **Save** qiling

---

### 4️⃣ Static va Media Files

**Bash Console da:**

```bash
cd ~/online-dokon
workon myenv

# Static fayllarni to'plash
python manage.py collectstatic --noinput

# Media papka yaratish
mkdir -p media
```

**Web tab da Static files sozlash:**

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/delux/online-dokon/staticfiles` |
| `/media/` | `/home/delux/online-dokon/media` |

---

### 5️⃣ Database

```bash
# Migratsiyalar
python manage.py migrate

# Superuser yaratish
python manage.py createsuperuser
```

---

### 6️⃣ Web App Configuration

**Web tab da:**

1. **Source code:** `/home/delux/online-dokon`
2. **Working directory:** `/home/delux/online-dokon`
3. **Virtualenv:** `/home/delux/.virtualenvs/myenv`

---

### 7️⃣ Reload

**Web** tabida yashil **Reload** tugmasini bosing!

**Saytingiz:** https://delux.pythonanywhere.com

---

## ❌ Xatolar va Yechimlar

### ImportError: No module named 'django'
```bash
workon myenv
pip install -r requirements.txt
```

### ModuleNotFoundError: No module named 'setting'
WSGI faylda `path = '/home/delux/online-dokon'` to'g'ri ekanligini tekshiring

### Static fayllar yuklanmayapti
```bash
python manage.py collectstatic --noinput --clear
```
Web tab da Static files yo'llarini tekshiring

### DisallowedHost at /
`settings.py` da `ALLOWED_HOSTS = ['delux.pythonanywhere.com']` bor ekanligini tekshiring

---

## 🔄 Yangilanishlarni Deploy Qilish

```bash
cd ~/online-dokon
git pull origin main
workon myenv
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
```

**Web tab da Reload qiling!**

---

## 📝 Muhim Eslatmalar

- ✅ Barcha yo'llar `delux` username ga moslashtirilgan
- ✅ GitHub repo: `usnatdinov02/online-dokon`
- ✅ Sayt: `delux.pythonanywhere.com`
- ⚠️ Production da `DEBUG = False` qiling
- 🔒 `SECRET_KEY` ni o'zgartiring

---

## 🔍 Log Fayllar

Xato bo'lsa tekshiring:
- **Error log:** Web tab > Log files > Error log
- **Server log:** Web tab > Log files > Server log
- **Access log:** Web tab > Log files > Access log

---

✅ **Tayyor! Saytingiz ishga tushadi!**
