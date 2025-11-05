from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.contrib.auth import login, logout
from django.contrib.auth.decorators import login_required
from django.db.models import Q, Avg
from django.core.paginator import Paginator
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import json
from .models import Category, Product, Cart, CartItem, Order, OrderItem, Review, ContactMessage
from .models import Address, Wishlist, UserProfile
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django import forms
from django.shortcuts import Http404
from .forms import UserRegistrationForm

def get_or_create_cart(request):
    """Savatchani olish yoki yaratish"""
    if request.user.is_authenticated:
        cart, created = Cart.objects.get_or_create(user=request.user)
    else:
        session_key = request.session.session_key
        if not session_key:
            request.session.create()
            session_key = request.session.session_key
        cart, created = Cart.objects.get_or_create(session_key=session_key)
    return cart

def home(request):
    """Bosh sahifa"""
    featured_products = Product.objects.filter(is_featured=True, is_active=True)[:6]
    categories = Category.objects.all()[:6]
    # Recently viewed products (stored in session)
    recent_ids = request.session.get('recently_viewed', [])
    recent_products = Product.objects.filter(id__in=recent_ids, is_active=True)

    context = {
        'featured_products': featured_products,
        'categories': categories,
        'recent_products': recent_products,
    }
    return render(request, 'index.html', context)


def info(request):
    """Sayt haqida sahifasi"""
    return render(request, 'info.html')

def faq(request):
    """FAQ sahifasi - tez-tez so'raladigan savollar"""
    faqs = [
        {'q': 'Qanday qilib buyurtma berish mumkin?', 'a': 'Mahsulotni tanlab, savatga qo\'shing va chekout sahifasida to\'lov ma\'lumotlarini kiriting.'},
        {'q': 'Yetkazib berish qancha vaqt oladi?', 'a': 'Odatda 3-7 ish kuni ichida yetkazib beriladi.'},
        {'q': 'Qaytarish siyosati qanday?', 'a': 'Mahsulot qabul qilingandan so\'ng 14 kun ichida qaytarish mumkin.'},
    ]
    return render(request, 'faq.html', {'faqs': faqs})

def contact(request):
    """Kontakt sahifasi"""
    if request.method == 'POST':
        # Soddalashtirilgan: form ma'lumotini olish va xabar yuborish
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')
        # Saqlaymiz va tasdiq xabari chiqaramiz
        try:
            ContactMessage.objects.create(name=name, email=email, message=message)
            messages.success(request, 'Xabaringiz uchun rahmat! Tez orada javob olasiz.')
        except Exception:
            messages.error(request, 'Xabar saqlanmadi — iltimos qayta urinib ko\'ring.')
        return redirect('contact')
    return render(request, 'contact.html')


# --- User features: Wishlist, Profile, Addresses ---
@login_required
def wishlist_view(request):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    products = wishlist.products.all()
    return render(request, 'wishlist.html', {'products': products})


@login_required
def add_to_wishlist(request, product_id):
    product = get_object_or_404(Product, id=product_id, is_active=True)
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    wishlist.products.add(product)
    messages.success(request, f'{product.name} wishlist-ga qo\'shildi')
    return redirect('product_detail', product_id=product_id)


@login_required
def remove_from_wishlist(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    wishlist = get_object_or_404(Wishlist, user=request.user)
    wishlist.products.remove(product)
    messages.success(request, f'{product.name} wishlist-dan o\'chirildi')
    return redirect('wishlist')


class ProfileForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


@login_required
def edit_profile(request):
    # Handle combined user + profile forms
    try:
        profile = request.user.profile
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)

    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=request.user)
        profile_form = None
        try:
            profile_form = __import__('django').forms.forms.Form
        except Exception:
            profile_form = None

        # Use our ProfileModelForm
        from .forms import ProfileModelForm
        pform = ProfileModelForm(request.POST, request.FILES, instance=profile)

        if form.is_valid() and pform.is_valid():
            form.save()
            pform.save()
            messages.success(request, 'Profil yangilandi')
            return redirect('edit_profile')
        else:
            messages.error(request, 'Iltimos, toʻgʻri maʼlumotlarni kiriting.')
    else:
        form = ProfileForm(instance=request.user)
        from .forms import ProfileModelForm
        pform = ProfileModelForm(instance=getattr(request.user, 'profile', None))

    return render(request, 'profile_edit.html', {'form': form, 'profile_form': pform})


class AddressForm(forms.ModelForm):
    class Meta:
        model = Address
        fields = ['title', 'full_name', 'phone', 'line1', 'line2', 'city', 'postal_code', 'country', 'is_default']


@login_required
def address_list(request):
    addresses = Address.objects.filter(user=request.user)
    return render(request, 'addresses.html', {'addresses': addresses})


@login_required
def address_add(request):
    if request.method == 'POST':
        form = AddressForm(request.POST)
        if form.is_valid():
            addr = form.save(commit=False)
            addr.user = request.user
            if addr.is_default:
                Address.objects.filter(user=request.user, is_default=True).update(is_default=False)
            addr.save()
            messages.success(request, 'Manzil qo\'shildi')
            return redirect('address_list')
    else:
        form = AddressForm()
    return render(request, 'address_form.html', {'form': form})


@login_required
def address_delete(request, address_id):
    addr = get_object_or_404(Address, id=address_id, user=request.user)
    addr.delete()
    messages.success(request, 'Manzil o\'chirildi')
    return redirect('address_list')

def terms(request):
    """Foydalanish shartlari"""
    return render(request, 'terms.html')

def product_list(request):
    """Mahsulotlar ro'yxati"""
    products = Product.objects.filter(is_active=True)
    categories = Category.objects.all()
    
    # Qidiruv
    search_query = request.GET.get('search')
    if search_query:
        products = products.filter(
            Q(name__icontains=search_query) | 
            Q(description__icontains=search_query)
        )
    
    # Kategoriya bo'yicha filtr
    category_id = request.GET.get('category')
    if category_id:
        products = products.filter(category_id=category_id)
    
    # Pagination
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    
    context = {
        'products': products,
        'categories': categories,
        'search_query': search_query,
        'selected_category': category_id,
    }
    return render(request, 'products.html', context)

def product_detail(request, product_id):
    """Mahsulot tafsilotlari + sharhlar"""
    product = get_object_or_404(Product, id=product_id, is_active=True)
    related_products = Product.objects.filter(
        category=product.category,
        is_active=True
    ).exclude(id=product_id)[:4]

    reviews = product.reviews.select_related('user').all()
    avg_rating = reviews.aggregate(Avg('rating'))['rating__avg'] if reviews else None
    reviews_count = reviews.count()

    can_review = False
    has_reviewed = False
    if request.user.is_authenticated:
        has_reviewed = reviews.filter(user=request.user).exists()
        # Faqat yetkazilgan (delivered) buyurtmalardagi ushbu product bo'lsa
        can_review = OrderItem.objects.filter(
            order__user=request.user,
            order__status='delivered',
            product=product
        ).exists() and not has_reviewed

    # Agar hech qanday sharh bo'lmasa, ko'rsatish uchun 2-3 ta fake sharhlar
    fake_reviews = []
    if reviews_count == 0:
        fake_reviews = [
            {'username': 'Bekzod', 'rating': 5, 'comment': 'Juda aʼlo sifat! Tavsiya qilaman.', 'created_at': None},
            {'username': 'Dilshod', 'rating': 4, 'comment': 'Narxiga yarasha yaxshi mahsulot.', 'created_at': None},
        ]

    # Track recently viewed in session (keep most recent 6)
    try:
        rv = request.session.get('recently_viewed', [])
        if product_id in rv:
            rv.remove(product_id)
        rv.insert(0, product_id)
        request.session['recently_viewed'] = rv[:6]
    except Exception:
        request.session['recently_viewed'] = [product_id]

    context = {
        'product': product,
        'related_products': related_products,
        'reviews': reviews,
        'avg_rating': avg_rating,
        'reviews_count': reviews_count,
        'can_review': can_review,
        'has_reviewed': has_reviewed,
        'fake_reviews': fake_reviews,
    }
    return render(request, 'product_detail.html', context)

def cart_view(request):
    """Savatcha sahifasi"""
    cart = get_or_create_cart(request)
    cart_items = cart.items.all()
    
    total_price = sum(item.total_price for item in cart_items)
    
    context = {
        'cart_items': cart_items,
        'total_price': total_price,
    }
    return render(request, 'cart.html', context)

@csrf_exempt
def add_to_cart(request):
    """Savatchaga qo'shish"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            product_id = data.get('product_id')
            quantity = int(data.get('quantity', 1))
            
            product = get_object_or_404(Product, id=product_id, is_active=True)
            cart = get_or_create_cart(request)
            
            cart_item, created = CartItem.objects.get_or_create(
                cart=cart,
                product=product,
                defaults={'quantity': quantity}
            )
            
            if not created:
                cart_item.quantity += quantity
                cart_item.save()
            
            return JsonResponse({
                'success': True,
                'message': f'{product.name} savatchaga qo\'shildi!',
                'cart_count': cart.items.count()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Xatolik yuz berdi!'
            })
    
    return JsonResponse({'success': False, 'message': 'Noto\'g\'ri so\'rov!'})

@csrf_exempt
def update_cart_item(request):
    """Savatcha elementini yangilash"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            quantity = int(data.get('quantity', 1))
            
            cart_item = get_object_or_404(CartItem, id=item_id)
            
            if quantity <= 0:
                cart_item.delete()
            else:
                cart_item.quantity = quantity
                cart_item.save()
            
            cart = cart_item.cart
            total_price = sum(item.total_price for item in cart.items.all())
            
            return JsonResponse({
                'success': True,
                'total_price': float(total_price),
                'cart_count': cart.items.count()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Xatolik yuz berdi!'
            })
    
    return JsonResponse({'success': False, 'message': 'Noto\'g\'ri so\'rov!'})

@csrf_exempt
def remove_from_cart(request):
    """Savatchadan o'chirish"""
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            item_id = data.get('item_id')
            
            cart_item = get_object_or_404(CartItem, id=item_id)
            cart_item.delete()
            
            cart = cart_item.cart
            total_price = sum(item.total_price for item in cart.items.all())
            
            return JsonResponse({
                'success': True,
                'total_price': float(total_price),
                'cart_count': cart.items.count()
            })
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'message': 'Xatolik yuz berdi!'
            })
    
    return JsonResponse({'success': False, 'message': 'Noto\'g\'ri so\'rov!'})

def checkout(request):
    """Buyurtma berish sahifasi"""
    cart = get_or_create_cart(request)
    cart_items = cart.items.all()
    
    if not cart_items:
        messages.warning(request, 'Savatchangiz bo\'sh!')
        return redirect('cart')
    
    total_price = sum(item.total_price for item in cart_items)
    
    if request.method == 'POST':
        try:
            # Buyurtma yaratish
            order = Order.objects.create(
                user=request.user if request.user.is_authenticated else None,
                session_key=request.session.session_key if not request.user.is_authenticated else None,
                first_name=request.POST.get('first_name'),
                last_name=request.POST.get('last_name'),
                email=request.POST.get('email'),
                phone=request.POST.get('phone'),
                address=request.POST.get('address'),
                total_amount=total_price
            )
            
            # Buyurtma elementlarini yaratish
            for cart_item in cart_items:
                OrderItem.objects.create(
                    order=order,
                    product=cart_item.product,
                    quantity=cart_item.quantity,
                    price=cart_item.product.price
                )
            
            # Savatchani tozalash
            cart_items.delete()
            
            messages.success(request, f'Buyurtma muvaffaqiyatli berildi! Buyurtma raqami: #{order.id}')
            return redirect('order_success', order_id=order.id)
            
        except Exception as e:
            messages.error(request, 'Buyurtma berishda xatolik yuz berdi!')
    
    context = {
        'cart_items': cart_items,
        'total_price': total_price,
    }
    return render(request, 'checkout.html', context)

def order_success(request, order_id):
    """Buyurtma muvaffaqiyatli sahifasi"""
    order = get_object_or_404(Order, id=order_id)
    context = {'order': order}
    return render(request, 'order_success.html', context)

def category_products(request, category_id):
    """Kategoriya bo'yicha mahsulotlar"""
    category = get_object_or_404(Category, id=category_id)
    products = Product.objects.filter(category=category, is_active=True)
    
    # Pagination
    paginator = Paginator(products, 12)
    page_number = request.GET.get('page')
    products = paginator.get_page(page_number)
    
    context = {
        'category': category,
        'products': products,
    }
    return render(request, 'category_products.html', context)

def register(request):
    """Foydalanuvchi ro'yxatdan o'tish"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'Xush kelibsiz, {user.first_name}! Ro\'yxatdan muvaffaqiyatli o\'tdingiz.')
            return redirect('home')
    else:
        form = UserRegistrationForm()
    
    context = {
        'form': form,
    }
    return render(request, 'register.html', context)

def user_logout(request):
    """Foydalanuvchi chiqish"""
    if request.user.is_authenticated:
        logout(request)
        messages.success(request, 'Siz muvaffaqiyatli tizimdan chiqdingiz.')
    return redirect('home')

def cart_count(request):
    """Savatcha elementlari sonini olish"""
    cart = get_or_create_cart(request)
    count = cart.items.count()
    return JsonResponse({'count': count})


@login_required
def wishlist_count(request):
    wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
    return JsonResponse({'count': wishlist.products.count()})


@login_required
def cancel_order(request, order_id):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    if order.status in ['pending', 'processing']:
        order.status = 'cancelled'
        order.save()
        messages.success(request, 'Buyurtma muvaffaqiyatli bekor qilindi.')
    else:
        messages.warning(request, 'Bu buyurtma bekor qilish uchun mos emas.')
    return redirect('order_detail', order_id=order.id)

@login_required
def user_profile(request):
    """Foydalanuvchi profili"""
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-created_at')[:10]
    
    context = {
        'user': user,
        'orders': orders,
    }
    return render(request, 'user_profile.html', context)

@login_required
def order_history(request):
    """Buyurtmalar tarixi"""
    orders = Order.objects.filter(user=request.user).order_by('-created_at')
    
    # Pagination
    paginator = Paginator(orders, 10)
    page_number = request.GET.get('page')
    orders = paginator.get_page(page_number)
    
    context = {
        'orders': orders,
    }
    return render(request, 'order_history.html', context)

@login_required
def order_detail(request, order_id):
    """Buyurtma tafsilotlari"""
    order = get_object_or_404(Order, id=order_id, user=request.user)
    context = {
        'order': order,
    }
    return render(request, 'order_detail.html', context)

@login_required
def add_review(request, product_id):
    """Sharh qo'shish (faqat mahsulotni sotib olganlar)"""
    product = get_object_or_404(Product, id=product_id, is_active=True)

    # Faqat delivered bo'lgan buyurtma bo'yicha tekshiramiz
    purchased = OrderItem.objects.filter(
        order__user=request.user,
        order__status='delivered',
        product=product
    ).exists()

    if not purchased:
        messages.error(request, 'Sharh yozish uchun mahsulotni xarid qilgan boʼlishingiz kerak.')
        return redirect('product_detail', product_id=product.id)

    if request.method == 'POST':
        rating = int(request.POST.get('rating', 0))
        comment = request.POST.get('comment', '').strip()
        if rating < 1 or rating > 5 or not comment:
            messages.error(request, 'Iltimos, baho (1-5) va sharh matnini kiriting.')
            return redirect('product_detail', product_id=product.id)

        # Bitta foydalanuvchi bitta mahsulotga faqat bitta sharh
        if Review.objects.filter(product=product, user=request.user).exists():
            messages.warning(request, 'Siz allaqachon sharh qoldirgansiz.')
            return redirect('product_detail', product_id=product.id)

        Review.objects.create(
            product=product,
            user=request.user,
            rating=rating,
            comment=comment
        )
        messages.success(request, 'Sharhingiz saqlandi!')
        return redirect('product_detail', product_id=product.id)

    return redirect('product_detail', product_id=product.id)
