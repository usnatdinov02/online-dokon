#!/bin/bash
# PythonAnywhere da ishlatish uchun deploy buyruqlari
# Bu faylni Bash Console da ishga tushiring

echo "🚀 Deploy boshlandi..."

# 1. Virtual environment ni faollashtirish
echo "📦 Virtual environment faollashtirilmoqda..."
workon myenv

# 2. Git dan yangilanishlarni olish (agar git ishlatayotgan bo'lsangiz)
echo "🔄 Kod yangilanmoqda..."
# git pull origin main

# 3. Requirements ni yangilash
echo "📚 Dependencies o'rnatilmoqda..."
pip install -r requirements.txt

# 4. Database migratsiyalari
echo "🗄️ Database migratsiyalari bajarilmoqda..."
python manage.py migrate

# 5. Static fayllarni to'plash
echo "📁 Static fayllar to'planmoqda..."
python manage.py collectstatic --noinput

# 6. Tillar uchun translation fayllarni compile qilish
echo "🌐 Translation fayllar compile qilinmoqda..."
python manage.py compilemessages

echo "✅ Deploy muvaffaqiyatli yakunlandi!"
echo "⚠️ Web tab da 'Reload' tugmasini bosishni unutmang!"
