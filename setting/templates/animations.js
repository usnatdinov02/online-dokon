// ==========================================
// MERCEDES-BENZ - ANIMATIONS & INTERACTIONS
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== BACK TO TOP BUTTON ==========
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    
    // ========== FADE IN ON SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all product cards
    document.querySelectorAll('.product-card, .category-card').forEach(card => {
        observer.observe(card);
    });
    
    
    // ========== FAVORITE BUTTON ==========
    document.querySelectorAll('.product-card, .category-card').forEach(card => {
        // Add favorite button if not exists
        if (!card.querySelector('.btn-favorite')) {
            const favoriteBtn = document.createElement('button');
            favoriteBtn.className = 'btn-favorite';
            favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
            favoriteBtn.setAttribute('aria-label', 'Add to favorites');
            
            const cardImg = card.querySelector('.card-img-top');
            if (cardImg && cardImg.parentElement) {
                cardImg.parentElement.style.position = 'relative';
                cardImg.parentElement.appendChild(favoriteBtn);
            }
            
            favoriteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('active');
                const icon = this.querySelector('i');
                if (this.classList.contains('active')) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
            });
        }
    });
    
    
    // ========== CART BADGE ANIMATION ==========
    const originalAddToCart = document.querySelectorAll('.add-to-cart-btn');
    originalAddToCart.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartBadge = document.querySelector('#cart-count');
            if (cartBadge) {
                cartBadge.classList.add('animate');
                setTimeout(() => {
                    cartBadge.classList.remove('animate');
                }, 500);
            }
        });
    });
    
    
    // ========== IMAGE LAZY LOADING ==========
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
    
    
    // ========== RIPPLE EFFECT ON BUTTONS ==========
    document.querySelectorAll('.btn').forEach(button => {
        button.classList.add('ripple');
    });
    
    
    // ========== SMOOTH SCROLL FOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    
    
    // ========== SEARCH INPUT ANIMATION ==========
    const searchInputs = document.querySelectorAll('input[type="text"], input[type="search"]');
    searchInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    
    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    
    // ========== PRODUCT CARD STAGGER ANIMATION ==========
    const cards = document.querySelectorAll('.product-card, .category-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    
    // ========== FORM VALIDATION ANIMATION ==========
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const invalidInputs = form.querySelectorAll(':invalid');
            invalidInputs.forEach(input => {
                input.classList.add('bounce');
                setTimeout(() => {
                    input.classList.remove('bounce');
                }, 1000);
            });
        });
    });
    
    
    // ========== PRICE ANIMATION ==========
    const prices = document.querySelectorAll('.card-text strong, .price-section h2');
    prices.forEach(price => {
        price.classList.add('gradient-text');
    });
    
    
    // ========== LOADING SKELETON ==========
    function showSkeleton() {
        const container = document.querySelector('.products-section .row');
        if (container) {
            container.innerHTML = '';
            for (let i = 0; i < 6; i++) {
                const skeleton = `
                    <div class="col mb-4">
                        <div class="card">
                            <div class="skeleton" style="height: 200px;"></div>
                            <div class="card-body">
                                <div class="skeleton" style="height: 20px; margin-bottom: 10px;"></div>
                                <div class="skeleton" style="height: 15px; margin-bottom: 10px;"></div>
                                <div class="skeleton" style="height: 30px;"></div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += skeleton;
            }
        }
    }
    
    
    // ========== TOAST NOTIFICATION ==========
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast-notification ${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    };
    
    
    // ========== QUANTITY SELECTOR ANIMATION ==========
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        const wrapper = document.createElement('div');
        wrapper.className = 'quantity-wrapper';
        wrapper.style.cssText = 'display: flex; align-items: center; gap: 10px;';
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(input);
        
        const decreaseBtn = document.createElement('button');
        decreaseBtn.type = 'button';
        decreaseBtn.className = 'btn btn-sm btn-outline-secondary';
        decreaseBtn.innerHTML = '<i class="fas fa-minus"></i>';
        decreaseBtn.onclick = () => {
            if (input.value > input.min) {
                input.value = parseInt(input.value) - 1;
                input.classList.add('pulse');
                setTimeout(() => input.classList.remove('pulse'), 300);
            }
        };
        
        const increaseBtn = document.createElement('button');
        increaseBtn.type = 'button';
        increaseBtn.className = 'btn btn-sm btn-outline-secondary';
        increaseBtn.innerHTML = '<i class="fas fa-plus"></i>';
        increaseBtn.onclick = () => {
            if (input.value < input.max) {
                input.value = parseInt(input.value) + 1;
                input.classList.add('pulse');
                setTimeout(() => input.classList.remove('pulse'), 300);
            }
        };
        
        wrapper.insertBefore(decreaseBtn, input);
        wrapper.appendChild(increaseBtn);
    });
    
    
    console.log('✨ Mercedes-Benz animations loaded successfully!');
});


// ========== ADDITIONAL CSS ANIMATIONS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .navbar.scrolled {
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    
    .focused {
        transform: scale(1.02);
        transition: transform 0.3s ease;
    }
    
    .quantity-wrapper {
        display: inline-flex;
        align-items: center;
        gap: 10px;
    }
    
    .quantity-wrapper input {
        width: 60px;
        text-align: center;
    }
`;
document.head.appendChild(style);
