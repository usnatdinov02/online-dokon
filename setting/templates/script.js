// Mercedes-Benz Online Shop JavaScript

function initAll() {
    // Theme (dark mode) initialization
    const themeToggleBtn = document.getElementById('theme-toggle');
    function applyTheme(theme) {
        const isDark = theme === 'dark';
        // new approach: set attribute on <html>
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        // add legacy body class as many styles still target body.dark-mode
        document.body.classList.toggle('dark-mode', isDark);
        if (themeToggleBtn) {
            themeToggleBtn.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            themeToggleBtn.setAttribute('aria-pressed', isDark);
        }

        // Debug feedback: log and show a small alert so user sees the change
        try {
            console.log('Theme set to', isDark ? 'dark' : 'light');
            if (typeof showAlert === 'function') {
                showAlert('success', isDark ? 'Dark mode yoqildi' : 'Light mode yoqildi');
            }
        } catch (e) {
            // ignore
        }
    }
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    // Attach a second safety listener in case button exists before DOMContentLoaded in some templates
    const themeBtnEarly = document.getElementById('theme-toggle');
    if (themeBtnEarly && themeBtnEarly !== themeToggleBtn) {
        themeBtnEarly.addEventListener('click', function() {
            const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    // Initialize cart count
    updateCartCount();
    // Initialize wishlist count
    updateWishlistCount();

    // Create mobile bottom navigation dynamically (applies to all pages)
    function createMobileBottomNav() {
        try {
            if (window.innerWidth > 768) return; // only for small screens
            if (document.querySelector('.mobile-bottom-nav')) return; // already present

            const html = `\
    <div class="mobile-bottom-nav d-md-none">\
        <a href="/" class="${window.location.pathname === '/' ? 'active' : ''}">\
            <i class="far fa-smile icon"></i>\
            <span>Bosh sahifa</span>\
        </a>\
        <a href="/products/" class="${window.location.pathname.includes('/products') ? 'active' : ''}">\
            <i class="fas fa-th-large icon"></i>\
            <span>Katalog</span>\
        </a>\
        <a href="/cart/" class="${window.location.pathname.includes('/cart') ? 'active' : ''}">\
            <i class="fas fa-shopping-cart icon"></i>\
            <span>Savat</span>\
            <span id="mobile-cart-count" class="badge bg-danger">0</span>\
        </a>\
        <a href="/wishlist/" class="${window.location.pathname.includes('/wishlist') ? 'active' : ''}">\
            <i class="far fa-heart icon"></i>\
            <span>Saralangan</span>\
            <span id="mobile-wishlist-count" class="badge bg-warning text-dark">0</span>\
        </a>\
        <a href="/profile/" class="${window.location.pathname.includes('/profile') ? 'active' : ''}">\
            <i class="far fa-user icon"></i>\
            <span>Kabinet</span>\
        </a>\
    </div>`;

            document.body.insertAdjacentHTML('beforeend', html);

            // Update counts immediately
            updateCartCount();
            updateWishlistCount();
        } catch (e) {
            // ignore template rendering environments where template tags might break
            console.warn('Could not create mobile bottom nav dynamically', e);
        }
    }

    createMobileBottomNav();

    // Add to cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const quantity = document.getElementById('quantity') ? 
                parseInt(document.getElementById('quantity').value) || 1 : 1;
            
            addToCart(productId, quantity);
        });
    });

    // Quantity controls (decrease/increase and manual input)
    const qtyDecreases = document.querySelectorAll('.qty-decrease');
    qtyDecreases.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.itemId;
            const input = document.querySelector(`.qty-input[data-item-id="${id}"]`);
            if (!input) return;
            let val = parseInt(input.value) || 1;
            if (val > 1) val = val - 1;
            input.value = val;
            updateQuantity(id, val);
        });
    });

    const qtyIncreases = document.querySelectorAll('.qty-increase');
    qtyIncreases.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.itemId;
            const input = document.querySelector(`.qty-input[data-item-id="${id}"]`);
            if (!input) return;
            let val = parseInt(input.value) || 0;
            const max = parseInt(input.getAttribute('max')) || Infinity;
            if (val < max) val = val + 1;
            input.value = val;
            updateQuantity(id, val);
        });
    });

    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => {
        input.addEventListener('change', function() {
            const id = this.dataset.itemId;
            let val = parseInt(this.value) || 1;
            const max = parseInt(this.getAttribute('max')) || Infinity;
            if (val < 1) val = 1;
            if (val > max) val = max;
            this.value = val;
            updateQuantity(id, val);
        });
    });

    // Remove buttons
    const removeBtns = document.querySelectorAll('.remove-btn');
    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.itemId;
            removeFromCart(id);
        });
    });
    
    // Update cart item quantity
    window.updateQuantity = function(itemId, quantity) {
        updateCartItem(itemId, quantity);
    };
    
    // Remove from cart
    window.removeFromCart = function(itemId) {
        removeCartItem(itemId);
    };
    
    // Search functionality
    const searchForm = document.querySelector('form[method="GET"]');
    if (searchForm) {
        const searchInput = searchForm.querySelector('input[name="search"]');
        if (searchInput) {
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchForm.submit();
                }
            });
        }
    }
    
    // Form validation
    const forms = document.querySelectorAll('form[novalidate]');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
            }
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Image lazy loading
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
} else {
    initAll();
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    const btn = document.querySelector(`[data-id="${productId}"]`);
    const originalText = btn.innerHTML;
    
    // Show loading state
    btn.innerHTML = '<span class="loading"></span> Qo\'shilmoqda...';
    btn.disabled = true;
    
    fetch('/add-to-cart/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            product_id: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Show success message
            showAlert('success', data.message);
            
            // Update cart count
            updateCartCount();
            
            // Update button state
            btn.innerHTML = '<i class="fas fa-check"></i> Qo\'shildi!';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-success');
            
            // Reset button after 2 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-primary');
                btn.disabled = false;
            }, 2000);
        } else {
            showAlert('danger', data.message);
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('danger', 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        btn.innerHTML = originalText;
        btn.disabled = false;
    });
}

// Update cart item quantity
function updateCartItem(itemId, quantity) {
    fetch('/update-cart-item/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            item_id: itemId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update total price
            const totalPriceElement = document.getElementById('total-price');
            const subtotalElement = document.getElementById('subtotal');
            
            if (totalPriceElement) {
                totalPriceElement.textContent = '$' + data.total_price.toFixed(2);
            }
            if (subtotalElement) {
                subtotalElement.textContent = '$' + data.total_price.toFixed(2);
            }
            
            // Update cart count
            updateCartCount();
            
            // If quantity is 0, remove the item from DOM
            if (quantity <= 0) {
                const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
                if (cartItem) {
                    cartItem.remove();
                }
            }
        } else {
            showAlert('danger', data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('danger', 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
    });
}

// Remove cart item
function removeCartItem(itemId) {
    if (confirm('Bu mahsulotni savatchadan o\'chirishni xohlaysizmi?')) {
        fetch('/remove-from-cart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({
                item_id: itemId
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Remove item from DOM
                const cartItem = document.querySelector(`[data-item-id="${itemId}"]`);
                if (cartItem) {
                    cartItem.remove();
                }
                
                // Update total price
                const totalPriceElement = document.getElementById('total-price');
                const subtotalElement = document.getElementById('subtotal');
                
                if (totalPriceElement) {
                    totalPriceElement.textContent = '$' + data.total_price.toFixed(2);
                }
                if (subtotalElement) {
                    subtotalElement.textContent = '$' + data.total_price.toFixed(2);
                }
                
                // Update cart count
                updateCartCount();
                
                showAlert('success', 'Mahsulot savatchadan o\'chirildi');
            } else {
                showAlert('danger', data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('danger', 'Xatolik yuz berdi. Qaytadan urinib ko\'ring.');
        });
    }
}

// Update cart count
function updateCartCount() {
    fetch('/cart-count/')
    .then(response => response.json())
    .then(data => {
        const cartCountElements = document.querySelectorAll('#cart-count');
        cartCountElements.forEach(element => {
            element.textContent = data.count;
        });
        // mobile badge (if present)
        const mobileCart = document.getElementById('mobile-cart-count');
        if (mobileCart) mobileCart.textContent = data.count;
    })
    .catch(error => {
        console.error('Error updating cart count:', error);
    });
}


// Update wishlist count (for logged-in users)
function updateWishlistCount() {
    fetch('/wishlist-count/')
    .then(response => {
        if (!response.ok) throw new Error('No wishlist count');
        return response.json();
    })
    .then(data => {
        const els = document.querySelectorAll('#wishlist-count');
        els.forEach(el => el.textContent = data.count);
        const mobileWish = document.getElementById('mobile-wishlist-count');
        if (mobileWish) mobileWish.textContent = data.count;
    })
    .catch(err => {
        // silently ignore for anonymous users or if endpoint not available
        // console.log('Wishlist count not available', err);
    });
}

// Show alert message
function showAlert(type, message) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert alert at the top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Form validation
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    // Email validation
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            emailField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Phone validation
    const phoneField = form.querySelector('input[type="tel"]');
    if (phoneField && phoneField.value) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phoneField.value)) {
            phoneField.classList.add('is-invalid');
            isValid = false;
        }
    }
    
    // Password confirmation
    const password1 = form.querySelector('input[name="password1"]');
    const password2 = form.querySelector('input[name="password2"]');
    if (password1 && password2 && password1.value !== password2.value) {
        password2.classList.add('is-invalid');
        isValid = false;
    }
    
    if (!isValid) {
        showAlert('danger', 'Iltimos, barcha majburiy maydonlarni to\'g\'ri to\'ldiring.');
    }
    
    return isValid;
}

// Get CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    const scrollBtn = document.getElementById('scroll-to-top');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

// Image zoom functionality
function initImageZoom() {
    const productImages = document.querySelectorAll('.product-image-container img');
    productImages.forEach(img => {
        img.addEventListener('click', function() {
            // Create modal for image zoom
            const modal = document.createElement('div');
            modal.className = 'modal fade';
            modal.innerHTML = `
                <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Mahsulot rasmi</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${this.src}" class="img-fluid" alt="${this.alt}">
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            const bsModal = new bootstrap.Modal(modal);
            bsModal.show();
            
            // Remove modal from DOM when hidden
            modal.addEventListener('hidden.bs.modal', function() {
                modal.remove();
            });
        });
    });
}

// Initialize image zoom
initImageZoom();

// Search suggestions
function initSearchSuggestions() {
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        let searchTimeout;
        
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    fetchSearchSuggestions(query);
                }, 300);
            }
        });
    }
}

// Fetch search suggestions
function fetchSearchSuggestions(query) {
    fetch(`/search-suggestions/?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .then(data => {
        if (data.suggestions && data.suggestions.length > 0) {
            showSearchSuggestions(data.suggestions);
        }
    })
    .catch(error => {
        console.error('Error fetching suggestions:', error);
    });
}

// Show search suggestions
function showSearchSuggestions(suggestions) {
    // Remove existing suggestions
    const existingSuggestions = document.querySelector('.search-suggestions');
    if (existingSuggestions) {
        existingSuggestions.remove();
    }
    
    // Create suggestions dropdown
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'search-suggestions position-absolute bg-white border rounded shadow-lg';
    suggestionsDiv.style.cssText = 'top: 100%; left: 0; right: 0; z-index: 1000; max-height: 300px; overflow-y: auto;';
    
    suggestions.forEach(suggestion => {
        const suggestionItem = document.createElement('div');
        suggestionItem.className = 'p-2 border-bottom cursor-pointer';
        suggestionItem.innerHTML = suggestion.name;
        suggestionItem.addEventListener('click', function() {
            const searchInput = document.querySelector('input[name="search"]');
            if (searchInput) {
                searchInput.value = suggestion.name;
                suggestionsDiv.remove();
                searchInput.form.submit();
            }
        });
        suggestionsDiv.appendChild(suggestionItem);
    });
    
    // Position suggestions
    const searchInput = document.querySelector('input[name="search"]');
    if (searchInput) {
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(suggestionsDiv);
    }
}

// Initialize search suggestions
initSearchSuggestions();

// Add scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.id = 'scroll-to-top';
scrollToTopBtn.className = 'btn btn-primary position-fixed';
scrollToTopBtn.style.cssText = 'bottom: 20px; right: 20px; z-index: 1000; display: none; border-radius: 50%; width: 50px; height: 50px;';
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.addEventListener('click', scrollToTop);
document.body.appendChild(scrollToTopBtn);

// Initialize all functionality
console.log('Mercedes-Benz Online Shop JavaScript loaded successfully!');

// Star rating interaction on product detail page
(function initStarRating(){
    const container = document.querySelector('.star-rating');
    if (!container) return;
    const stars = container.querySelectorAll('.star');
    const input = document.getElementById('ratingInput');
    const setActive = (val) => {
        stars.forEach(star => {
            const sVal = parseInt(star.getAttribute('data-value'));
            if (sVal <= val) {
                star.classList.add('active');
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('active');
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    };
    stars.forEach(star => {
        star.addEventListener('mouseenter', () => setActive(parseInt(star.getAttribute('data-value'))));
        star.addEventListener('mouseleave', () => setActive(parseInt(input.value || '0')));
        star.addEventListener('click', () => {
            const val = parseInt(star.getAttribute('data-value'));
            input.value = val;
            setActive(val);
        });
    });
})();