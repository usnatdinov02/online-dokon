# 🚀 PythonAnywhere ga Deploy qilish qo'llanmasi

## 1️⃣ PythonAnywhere ga kirish va yangi Web App yaratish

1. **PythonAnywhere** ga kiring: https://www.pythonanywhere.com
2. **Web** tabiga o'ting
3. **Add a new web app** tugmasini bosing
4. **Manual configuration** ni tanlang
5. **Python 3.10** (yoki mavjud versiya) ni tanlang

---

## 2️⃣ Loyihani PythonAnywhere ga yuklash

### Bash Console ni oching va quyidagi buyruqlarni bajaring:

```bash
# Home directory ga o'ting
cd ~

# Loyihani GitHub dan clone qiling (agar GitHub da bo'lsa)
# git clone https://github.com/sizning-username/mercedes_shop.git

# Yoki loyihani zip qilib yuklang va unzip qiling
# unzip mercedes_shop.zip

# Loyiha papkasiga o'ting
cd mercedes_shop
```

---

## 3️⃣ Virtual Environment yaratish

```bash
# Virtual environment yaratish
mkvirtualenv --python=/usr/bin/python3.10 myenv

# Virtual environment ni faollashtirish
workon myenv

# Requirements ni o'rnatish
pip install -r requirements.txt
```

---

## 4️⃣ WSGI faylni sozlash

1. **Web** tabida **WSGI configuration file** linkini bosing
2. Faylning ichidagi hamma narsani o'chiring
3. `pythonanywhere_wsgi.py` faylidagi kodni ko'chirib qo'ying
4. **MUHIM**: Quyidagi qatorlarni o'z yo'llaringizga o'zgartiring:

```python
# Loyiha yo'li
path = '/home/usnadtinov02/mercedes_shop'  # O'z username va loyiha nomingiz

# Virtual environment yo'li (agar kerak bo'lsa)
# activate_this = '/home/usnadtinov02/.virtualenvs/myenv/bin/activate_this.py'
```

5. **Save** tugmasini bosing

---

## 5️⃣ Static va Media fayllarni sozlash

### Bash Console da:

```bash
# Static fayllarni to'plash
python manage.py collectstatic --noinput

# Media papkasini yaratish
mkdir -p media
```

### Web tab da Static/Media files sozlash:

1. **Static files** bo'limida:
   - **URL**: `/static/`
   - **Directory**: `/home/usnadtinov02/mercedes_shop/staticfiles`

2. **Media files** uchun yangi qator qo'shing:
   - **URL**: `/media/`
   - **Directory**: `/home/usnadtinov02/mercedes_shop/media`

---

## 6️⃣ Database ni sozlash

```bash
# Migratsiyalarni bajarish
python manage.py migrate

# Superuser yaratish
python manage.py createsuperuser
```

---

## 7️⃣ Web App ni reload qilish

1. **Web** tabiga qayting
2. Yuqorida **Reload** tugmasini bosing (yashil tugma)
3. Saytingizni oching: `https://usnadtinov02.pythonanywhere.com`

---

## 🔧 Keng uchraydigan xatolar va yechimlar

### ❌ Xato: "ImportError: No module named 'django'"

**Yechim**: Virtual environment to'g'ri sozlanmaganligini bildiradi.

```bash
# Virtual environment ni qayta yaratish
mkvirtualenv --python=/usr/bin/python3.10 myenv
workon myenv
pip install -r requirements.txt
```

WSGI faylda virtual environment yo'lini to'g'ri ko'rsating.

---

### ❌ Xato: "ModuleNotFoundError: No module named 'setting'"

**Yechim**: Loyiha yo'li to'g'ri ko'rsatilmagan.

WSGI faylda `path` o'zgaruvchisini tekshiring:
```python
path = '/home/usnadtinov02/mercedes_shop'  # To'g'ri yo'l
```

---

### ❌ Xato: Static fayllar yuklanmayapti

**Yechim**:

```bash
# Static fayllarni qayta to'plash
python manage.py collectstatic --noinput --clear
```

Web tab da Static files yo'lini tekshiring.

---

### ❌ Xato: "DisallowedHost at /"

**Yechim**: `settings.py` da ALLOWED_HOSTS ni to'g'rilang:

```python
ALLOWED_HOSTS = ['usnadtinov02.pythonanywhere.com', 'localhost']
```

---

## 📝 Production uchun muhim sozlamalar

### `settings.py` da o'zgartirish kerak:

```python
# 1. DEBUG ni o'chirish
DEBUG = False

# 2. SECRET_KEY ni xavfsiz qilish
# Environment variable dan oling yoki maxfiy saqlang
SECRET_KEY = os.environ.get('SECRET_KEY', 'default-secret-key')

# 3. ALLOWED_HOSTS ni aniq ko'rsatish
ALLOWED_HOSTS = ['usnadtinov02.pythonanywhere.com']

# 4. STATIC_ROOT va MEDIA_ROOT ni to'g'rilash
STATIC_ROOT = '/home/usnadtinov02/mercedes_shop/staticfiles'
MEDIA_ROOT = '/home/usnadtinov02/mercedes_shop/media'

# 5. Database (agar MySQL ishlatmoqchi bo'lsangiz)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'usnadtinov02$default',
#         'USER': 'usnadtinov02',
#         'PASSWORD': 'your-password',
#         'HOST': 'usnadtinov02.mysql.pythonanywhere-services.com',
#     }
# }
```

---

## 🎯 Tekshirish ro'yxati

- [ ] Virtual environment yaratildi va faollashtirildi
- [ ] requirements.txt o'rnatildi
- [ ] WSGI fayl to'g'ri sozlandi
- [ ] Static fayllar to'plandi (collectstatic)
- [ ] Static/Media yo'llari Web tab da sozlandi
- [ ] Database migratsiyalari bajarildi
- [ ] ALLOWED_HOSTS sozlandi
- [ ] Web app reload qilindi

---

## 📞 Yordam

Agar muammo yechilmasa:

1. **Error logs** ni tekshiring: Web tab > Log files > Error log
2. **Server log** ni ko'ring: Web tab > Log files > Server log
3. PythonAnywhere **Forums** ga murojaat qiling

---

## 🔄 Yangilanishlarni deploy qilish

Har safar kod o'zgartirganda:

```bash
# Loyihani yangilash (agar git ishlatayotgan bo'lsangiz)
cd ~/mercedes_shop
git pull origin main

# Virtual environment ni faollashtirish
workon myenv

# Yangi requirements o'rnatish (agar kerak bo'lsa)
pip install -r requirements.txt

# Migratsiyalar (agar kerak bo'lsa)
python manage.py migrate

# Static fayllarni yangilash
python manage.py collectstatic --noinput
```

**Web tab da Reload tugmasini bosing!**

---

✅ **Tayyor! Saytingiz ishga tushdi!**
