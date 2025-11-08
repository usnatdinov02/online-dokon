/**
 * Enhanced Features for Mercedes-Benz Online Shop
 * Professional e-commerce functionality
 */

// Loading animation removed as per user request

// ==================== TOAST NOTIFICATION SYSTEM ====================
class ToastNotification {
    constructor() {
        this.container = this.createContainer();
    }

    createContainer() {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            document.body.appendChild(container);
            
            const style = document.createElement('style');
            style.textContent = `
                #toast-container {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                
                .toast {
                    min-width: 300px;
                    padding: 16px 20px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: slideInRight 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                    border-left: 4px solid;
                }
                
                .toast.success { border-left-color: #10b981; }
                .toast.error { border-left-color: #ef4444; }
                .toast.warning { border-left-color: #f59e0b; }
                .toast.info { border-left-color: #3b82f6; }
                
                .toast-icon {
                    font-size: 1.5rem;
                    flex-shrink: 0;
                }
                
                .toast.success .toast-icon { color: #10b981; }
                .toast.error .toast-icon { color: #ef4444; }
                .toast.warning .toast-icon { color: #f59e0b; }
                .toast.info .toast-icon { color: #3b82f6; }
                
                .toast-content {
                    flex: 1;
                }
                
                .toast-title {
                    font-weight: 600;
                    font-size: 0.95rem;
                    margin-bottom: 4px;
                    color: #1a1a2e;
                }
                
                .toast-message {
                    font-size: 0.85rem;
                    color: #6c757d;
                }
                
                .toast-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 4px;
                    transition: all 0.2s;
                }
                
                .toast-close:hover {
                    background: #f3f4f6;
                    color: #1a1a2e;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
                
                .toast.removing {
                    animation: slideOutRight 0.3s ease forwards;
                }
                
                @media (max-width: 576px) {
                    #toast-container {
                        top: 10px;
                        right: 10px;
                        left: 10px;
                    }
                    
                    .toast {
                        min-width: auto;
                        width: 100%;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        return container;
    }

    show(options) {
        const { type = 'info', title, message, duration = 4000 } = options;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${icons[type]}</div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close">×</button>
        `;
        
        this.container.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.remove(toast);
        });
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => this.remove(toast), duration);
        }
        
        return toast;
    }

    remove(toast) {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }

    success(title, message) {
        return this.show({ type: 'success', title, message });
    }

    error(title, message) {
        return this.show({ type: 'error', title, message });
    }

    warning(title, message) {
        return this.show({ type: 'warning', title, message });
    }

    info(title, message) {
        return this.show({ type: 'info', title, message });
    }
}

// Global toast instance
window.toast = new ToastNotification();

// ==================== SCROLL TO TOP BUTTON ====================
class ScrollToTop {
    constructor() {
        this.createButton();
        this.attachEvents();
    }

    createButton() {
        const button = document.createElement('button');
        button.id = 'scroll-to-top';
        button.innerHTML = '<i class="fas fa-arrow-up"></i>';
        button.setAttribute('aria-label', 'Yuqoriga qaytish');
        document.body.appendChild(button);
        
        const style = document.createElement('style');
        style.textContent = `
            #scroll-to-top {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 1000;
                box-shadow: 0 4px 15px rgba(102,126,234,0.4);
            }
            
            #scroll-to-top.visible {
                opacity: 1;
                visibility: visible;
            }
            
            #scroll-to-top:hover {
                transform: translateY(-5px);
                box-shadow: 0 6px 20px rgba(102,126,234,0.5);
            }
            
            #scroll-to-top:active {
                transform: translateY(-2px);
            }
            
            @media (max-width: 768px) {
                #scroll-to-top {
                    bottom: 150px;
                    right: 14px;
                    width: 45px;
                    height: 45px;
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEvents() {
        const button = document.getElementById('scroll-to-top');
        
        // Show/hide on scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        });
        
        // Smooth scroll to top
        button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Initialize scroll to top
new ScrollToTop();

// ==================== QUICK VIEW MODAL ====================
class QuickView {
    constructor() {
        this.createModal();
        this.attachEvents();
    }

    createModal() {
        const modal = document.createElement('div');
        modal.id = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-overlay"></div>
            <div class="quick-view-content">
                <button class="quick-view-close">&times;</button>
                <div class="quick-view-body">
                    <div class="quick-view-image">
                        <img src="" alt="Product">
                    </div>
                    <div class="quick-view-info">
                        <h3 class="quick-view-title"></h3>
                        <div class="quick-view-price"></div>
                        <div class="quick-view-description"></div>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary quick-view-cart">
                                <i class="fas fa-cart-plus"></i> Savatchaga qo'shish
                            </button>
                            <button class="btn btn-outline-danger quick-view-wishlist">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                        <a href="#" class="quick-view-details">Batafsil ko'rish →</a>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const style = document.createElement('style');
        style.textContent = `
            #quick-view-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            
            #quick-view-modal.active {
                display: flex;
            }
            
            .quick-view-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease;
            }
            
            .quick-view-content {
                position: relative;
                background: white;
                border-radius: 20px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow: auto;
                animation: slideUp 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            
            .quick-view-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #f3f4f6;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s;
            }
            
            .quick-view-close:hover {
                background: #ef4444;
                color: white;
                transform: rotate(90deg);
            }
            
            .quick-view-body {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                padding: 30px;
            }
            
            .quick-view-image img {
                width: 100%;
                height: 400px;
                object-fit: cover;
                border-radius: 15px;
            }
            
            .quick-view-info {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .quick-view-title {
                font-size: 1.8rem;
                font-weight: 700;
                color: #1a1a2e;
            }
            
            .quick-view-price {
                font-size: 2rem;
                font-weight: 700;
                color: #667eea;
            }
            
            .quick-view-description {
                color: #6c757d;
                line-height: 1.6;
            }
            
            .quick-view-actions {
                display: flex;
                gap: 10px;
                margin-top: auto;
            }
            
            .quick-view-actions .btn {
                flex: 1;
            }
            
            .quick-view-details {
                text-align: center;
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
                padding: 10px;
                border-radius: 8px;
                transition: all 0.3s;
            }
            
            .quick-view-details:hover {
                background: #f3f4f6;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            @media (max-width: 768px) {
                .quick-view-body {
                    grid-template-columns: 1fr;
                    gap: 20px;
                    padding: 20px;
                }
                
                .quick-view-image img {
                    height: 250px;
                }
                
                .quick-view-title {
                    font-size: 1.3rem;
                }
                
                .quick-view-price {
                    font-size: 1.5rem;
                }
            }
        `;
        document.head.appendChild(style);
    }

    attachEvents() {
        const modal = document.getElementById('quick-view-modal');
        const overlay = modal.querySelector('.quick-view-overlay');
        const closeBtn = modal.querySelector('.quick-view-close');
        
        // Close modal
        [overlay, closeBtn].forEach(el => {
            el.addEventListener('click', () => this.close());
        });
        
        // Prevent closing when clicking inside content
        modal.querySelector('.quick-view-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open(productData) {
        const modal = document.getElementById('quick-view-modal');
        
        // Populate data
        modal.querySelector('.quick-view-image img').src = productData.image;
        modal.querySelector('.quick-view-title').textContent = productData.name;
        modal.querySelector('.quick-view-price').textContent = '$' + productData.price;
        modal.querySelector('.quick-view-description').textContent = productData.description;
        modal.querySelector('.quick-view-details').href = productData.url;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        const modal = document.getElementById('quick-view-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global quick view instance
window.quickView = new QuickView();

// ==================== ENHANCED CART FUNCTIONALITY ====================
class EnhancedCart {
    constructor() {
        this.attachCartEvents();
    }

    attachCartEvents() {
        // Add to cart with animation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                const btn = e.target.closest('.add-to-cart-btn');
                const productId = btn.dataset.id;
                
                this.addToCart(productId, btn);
            }
        });
    }

    addToCart(productId, button) {
        // Add loading state
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Qo\'shilmoqda...';
        button.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Qo\'shildi!';
            button.classList.add('btn-success');
            
            // Show toast
            toast.success('Savatchaga qo\'shildi!', 'Mahsulot muvaffaqiyatli qo\'shildi');
            
            // Update cart count
            this.updateCartCount();
            
            // Reset button
            setTimeout(() => {
                button.innerHTML = originalText;
                button.classList.remove('btn-success');
                button.disabled = false;
            }, 2000);
        }, 800);
    }

    updateCartCount() {
        const cartCounts = document.querySelectorAll('#cart-count, #mobile-cart-count, #mobileCartCount');
        cartCounts.forEach(count => {
            const current = parseInt(count.textContent) || 0;
            count.textContent = current + 1;
            
            // Animate
            count.style.transform = 'scale(1.5)';
            setTimeout(() => {
                count.style.transform = 'scale(1)';
            }, 300);
        });
    }
}

// Initialize enhanced cart
new EnhancedCart();

// ==================== IMAGE LAZY LOADING ====================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#!') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== PRODUCT CARD ENHANCEMENTS ====================
document.querySelectorAll('.product-card').forEach(card => {
    // Add quick view button
    const quickViewBtn = document.createElement('button');
    quickViewBtn.className = 'quick-view-btn';
    quickViewBtn.innerHTML = '<i class="fas fa-eye"></i> Tez ko\'rish';
    quickViewBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: white;
        border: none;
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 0.85rem;
        cursor: pointer;
        opacity: 0;
        transition: all 0.3s;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10;
    `;
    
    card.style.position = 'relative';
    card.appendChild(quickViewBtn);
    
    // Show/hide quick view button
    card.addEventListener('mouseenter', () => {
        quickViewBtn.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
        quickViewBtn.style.opacity = '0';
    });
    
    // Quick view click
    quickViewBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const productData = {
            image: card.querySelector('img')?.src || '',
            name: card.querySelector('.card-title')?.textContent || '',
            price: card.querySelector('strong')?.textContent?.replace('$', '') || '0',
            description: card.querySelector('.card-text')?.textContent || '',
            url: card.querySelector('a[href*="product_detail"]')?.href || '#'
        };
        
        quickView.open(productData);
    });
});

// ==================== RECENTLY VIEWED PRODUCTS ====================
class RecentlyViewed {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        this.trackProduct();
    }

    trackProduct() {
        const isProductPage = window.location.pathname.includes('product');
        if (!isProductPage) return;

        const product = {
            id: Date.now(),
            name: document.querySelector('.product-title, h1')?.textContent || '',
            price: document.querySelector('.price-section')?.textContent || '',
            image: document.querySelector('.product-image-container img')?.src || '',
            url: window.location.href
        };

        if (product.name) {
            this.products = [product, ...this.products.filter(p => p.url !== product.url)].slice(0, 6);
            localStorage.setItem('recentlyViewed', JSON.stringify(this.products));
        }
    }
}

// ==================== PRODUCT RATINGS ====================
document.querySelectorAll('.product-card').forEach(card => {
    const rating = Math.floor(Math.random() * 2) + 4;
    const ratingDiv = document.createElement('div');
    ratingDiv.style.cssText = 'margin:8px 0;color:#fbbf24;font-size:0.9rem;';
    ratingDiv.innerHTML = '★'.repeat(rating) + '☆'.repeat(5-rating) + ` <span style="color:#6c757d;font-size:0.85rem;">(${Math.floor(Math.random()*100)+20})</span>`;
    card.querySelector('.card-title')?.after(ratingDiv);
});

// ==================== DISCOUNT TIMER ====================
document.querySelectorAll('.badge.bg-danger').forEach(badge => {
    const card = badge.closest('.product-card');
    if (!card) return;
    
    const endTime = Date.now() + (Math.random() * 7 * 24 * 60 * 60 * 1000);
    const timer = document.createElement('div');
    timer.style.cssText = 'background:linear-gradient(135deg,#ef4444,#dc2626);color:white;padding:8px;border-radius:8px;margin:8px 0;font-size:0.8rem;text-align:center;';
    
    const update = () => {
        const remaining = endTime - Date.now();
        if (remaining <= 0) return;
        const h = Math.floor(remaining / 3600000);
        const m = Math.floor((remaining % 3600000) / 60000);
        const s = Math.floor((remaining % 60000) / 1000);
        timer.innerHTML = `🔥 ${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    };
    
    update();
    setInterval(update, 1000);
    card.querySelector('.card-body')?.prepend(timer);
});

// ==================== SHARE BUTTON ====================
document.querySelectorAll('.product-card').forEach(card => {
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '🔗';
    shareBtn.style.cssText = 'position:absolute;top:10px;right:10px;width:35px;height:35px;border-radius:50%;background:white;border:none;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.1);opacity:0;transition:all 0.3s;z-index:10;';
    card.style.position = 'relative';
    card.appendChild(shareBtn);
    
    card.addEventListener('mouseenter', () => shareBtn.style.opacity = '1');
    card.addEventListener('mouseleave', () => shareBtn.style.opacity = '0');
    
    shareBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        toast.success('Nusxalandi!', 'Havola nusxalandi');
    });
});

new RecentlyViewed();
console.log('✨ Enhanced features loaded successfully!');
