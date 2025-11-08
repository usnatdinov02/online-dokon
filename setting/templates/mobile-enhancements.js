/**
 * Mobile-First Enhancements
 * Professional mobile UX improvements
 */

// ==================== TOUCH GESTURES ====================
class TouchGestures {
    constructor() {
        this.startX = 0;
        this.startY = 0;
        this.endX = 0;
        this.endY = 0;
        this.init();
    }

    init() {
        document.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            this.endX = e.changedTouches[0].clientX;
            this.endY = e.changedTouches[0].clientY;
            this.handleGesture();
        }, { passive: true });
    }

    handleGesture() {
        const diffX = this.endX - this.startX;
        const diffY = this.endY - this.startY;

        // Swipe detection
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.onSwipeRight();
                } else {
                    this.onSwipeLeft();
                }
            }
        } else {
            if (Math.abs(diffY) > 50) {
                if (diffY > 0) {
                    this.onSwipeDown();
                } else {
                    this.onSwipeUp();
                }
            }
        }
    }

    onSwipeLeft() {
        // Navigate to next product in gallery
        const nextBtn = document.querySelector('.carousel-control-next');
        if (nextBtn) nextBtn.click();
    }

    onSwipeRight() {
        // Navigate to previous product in gallery
        const prevBtn = document.querySelector('.carousel-control-prev');
        if (prevBtn) prevBtn.click();
    }

    onSwipeDown() {
        // Pull to refresh (if at top)
        if (window.scrollY === 0) {
            // Trigger refresh
            console.log('Pull to refresh');
        }
    }

    onSwipeUp() {
        // Quick scroll to top
    }
}

// ==================== MOBILE FILTER DRAWER ====================
class MobileFilterDrawer {
    constructor() {
        this.createDrawer();
        this.attachEvents();
    }

    createDrawer() {
        const drawer = document.createElement('div');
        drawer.id = 'mobile-filter-drawer';
        drawer.innerHTML = `
            <div class="filter-overlay"></div>
            <div class="filter-content">
                <div class="filter-header">
                    <h3><i class="fas fa-filter"></i> Filtr</h3>
                    <button class="filter-close">&times;</button>
                </div>
                <div class="filter-body">
                    <!-- Filters will be inserted here -->
                </div>
                <div class="filter-footer">
                    <button class="btn btn-secondary btn-reset">Tozalash</button>
                    <button class="btn btn-primary btn-apply">Qo'llash</button>
                </div>
            </div>
        `;
        document.body.appendChild(drawer);

        const style = document.createElement('style');
        style.textContent = `
            #mobile-filter-drawer {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 9999;
                display: none;
            }
            
            #mobile-filter-drawer.active {
                display: block;
            }
            
            .filter-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                backdrop-filter: blur(5px);
            }
            
            .filter-content {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                max-height: 80vh;
                background: white;
                border-radius: 20px 20px 0 0;
                animation: slideUp 0.3s ease;
                display: flex;
                flex-direction: column;
            }
            
            [data-theme="dark"] .filter-content {
                background: #1a1a2e;
            }
            
            .filter-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            [data-theme="dark"] .filter-header {
                border-bottom-color: #2d2d44;
            }
            
            .filter-header h3 {
                margin: 0;
                font-size: 1.2rem;
                color: #1a1a2e;
            }
            
            [data-theme="dark"] .filter-header h3 {
                color: #e6eef6;
            }
            
            .filter-close {
                background: none;
                border: none;
                font-size: 2rem;
                color: #6c757d;
                cursor: pointer;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s;
            }
            
            .filter-close:hover {
                background: #f0f0f0;
                color: #1a1a2e;
            }
            
            .filter-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .filter-footer {
                display: flex;
                gap: 10px;
                padding: 20px;
                border-top: 2px solid #f0f0f0;
            }
            
            [data-theme="dark"] .filter-footer {
                border-top-color: #2d2d44;
            }
            
            .filter-footer .btn {
                flex: 1;
                padding: 12px;
                border-radius: 10px;
                font-weight: 600;
            }
            
            @keyframes slideUp {
                from {
                    transform: translateY(100%);
                }
                to {
                    transform: translateY(0);
                }
            }
            
            /* Filter Groups */
            .filter-group {
                margin-bottom: 25px;
            }
            
            .filter-group-title {
                font-weight: 600;
                font-size: 1rem;
                margin-bottom: 12px;
                color: #1a1a2e;
            }
            
            [data-theme="dark"] .filter-group-title {
                color: #e6eef6;
            }
            
            .filter-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .filter-option {
                display: flex;
                align-items: center;
                padding: 12px;
                background: #f8f9fa;
                border-radius: 10px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            [data-theme="dark"] .filter-option {
                background: #0f1724;
            }
            
            .filter-option:active {
                transform: scale(0.98);
            }
            
            .filter-option input[type="checkbox"],
            .filter-option input[type="radio"] {
                margin-right: 12px;
                width: 20px;
                height: 20px;
            }
            
            /* Price Range Slider */
            .price-range-slider {
                padding: 20px 10px;
            }
            
            .price-range-slider input[type="range"] {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                outline: none;
                -webkit-appearance: none;
            }
            
            .price-range-slider input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                cursor: pointer;
            }
            
            .price-values {
                display: flex;
                justify-content: space-between;
                margin-top: 10px;
                font-weight: 600;
                color: #667eea;
            }
        `;
        document.head.appendChild(style);
    }

    attachEvents() {
        const drawer = document.getElementById('mobile-filter-drawer');
        const overlay = drawer.querySelector('.filter-overlay');
        const closeBtn = drawer.querySelector('.filter-close');

        [overlay, closeBtn].forEach(el => {
            el.addEventListener('click', () => this.close());
        });

        // Prevent closing when clicking inside
        drawer.querySelector('.filter-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    open() {
        document.getElementById('mobile-filter-drawer').classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        document.getElementById('mobile-filter-drawer').classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ==================== MOBILE SEARCH ENHANCEMENTS ====================
class MobileSearch {
    constructor() {
        this.init();
    }

    init() {
        const searchInputs = document.querySelectorAll('input[type="search"], input[name="search"]');
        
        searchInputs.forEach(input => {
            // Add search icon animation
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('search-focused');
            });

            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('search-focused');
            });

            // Real-time search suggestions
            let timeout;
            input.addEventListener('input', (e) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    this.fetchSuggestions(e.target.value);
                }, 300);
            });
        });
    }

    async fetchSuggestions(query) {
        if (query.length < 2) return;

        try {
            const response = await fetch(`/api/search-suggestions/?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            this.showSuggestions(data.suggestions);
        } catch (error) {
            console.error('Search error:', error);
        }
    }

    showSuggestions(suggestions) {
        let dropdown = document.getElementById('search-suggestions');
        
        if (!dropdown) {
            dropdown = document.createElement('div');
            dropdown.id = 'search-suggestions';
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                border-radius: 0 0 12px 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-height: 300px;
                overflow-y: auto;
                z-index: 1000;
                margin-top: 5px;
            `;
            
            const searchBox = document.querySelector('.search-box, .mobile-header .search-box');
            if (searchBox) {
                searchBox.style.position = 'relative';
                searchBox.appendChild(dropdown);
            }
        }

        if (suggestions.length === 0) {
            dropdown.style.display = 'none';
            return;
        }

        dropdown.innerHTML = suggestions.map(item => `
            <a href="/product/${item.id}/" class="suggestion-item" style="
                display: flex;
                align-items: center;
                padding: 12px;
                text-decoration: none;
                color: #1a1a2e;
                border-bottom: 1px solid #f0f0f0;
                transition: background 0.2s;
            ">
                ${item.image ? `<img src="${item.image}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 8px; margin-right: 12px;">` : ''}
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 0.9rem;">${item.name}</div>
                    <div style="color: #667eea; font-weight: 700;">$${item.price}</div>
                </div>
            </a>
        `).join('');

        dropdown.style.display = 'block';

        // Add hover effect
        dropdown.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                this.style.background = '#f8f9fa';
            });
            item.addEventListener('mouseleave', function() {
                this.style.background = 'white';
            });
        });
    }
}

// ==================== HAPTIC FEEDBACK ====================
class HapticFeedback {
    static vibrate(pattern = [10]) {
        if ('vibrate' in navigator) {
            navigator.vibrate(pattern);
        }
    }

    static light() {
        this.vibrate([5]);
    }

    static medium() {
        this.vibrate([10]);
    }

    static heavy() {
        this.vibrate([15]);
    }

    static success() {
        this.vibrate([10, 50, 10]);
    }

    static error() {
        this.vibrate([20, 50, 20, 50, 20]);
    }
}

// ==================== MOBILE OPTIMIZATIONS ====================
class MobileOptimizations {
    constructor() {
        this.init();
    }

    init() {
        // Prevent zoom on input focus (iOS)
        this.preventZoomOnFocus();
        
        // Add touch feedback to buttons
        this.addTouchFeedback();
        
        // Optimize images for mobile
        this.optimizeImages();
        
        // Add pull-to-refresh
        this.addPullToRefresh();
    }

    preventZoomOnFocus() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (window.innerWidth < 768) {
                input.style.fontSize = '16px'; // Prevents iOS zoom
            }
        });
    }

    addTouchFeedback() {
        const buttons = document.querySelectorAll('button, .btn, a.btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.95)';
                HapticFeedback.light();
            }, { passive: true });

            btn.addEventListener('touchend', function() {
                this.style.transform = 'scale(1)';
            }, { passive: true });
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            img.loading = 'lazy';
            
            // Add placeholder while loading
            if (!img.complete) {
                img.style.background = 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)';
                img.style.backgroundSize = '200% 100%';
                img.style.animation = 'loading 1.5s infinite';
            }
        });

        // Add loading animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }
        `;
        document.head.appendChild(style);
    }

    addPullToRefresh() {
        let startY = 0;
        let pulling = false;

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                pulling = true;
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!pulling) return;

            const currentY = e.touches[0].clientY;
            const diff = currentY - startY;

            if (diff > 80) {
                // Show refresh indicator
                console.log('Refreshing...');
                HapticFeedback.medium();
                location.reload();
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            pulling = false;
        }, { passive: true });
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile devices
    if (window.innerWidth < 768) {
        new TouchGestures();
        window.mobileFilterDrawer = new MobileFilterDrawer();
        new MobileSearch();
        new MobileOptimizations();
        
        console.log('📱 Mobile enhancements loaded!');
    }
});

// Add filter button click handler
document.addEventListener('click', (e) => {
    if (e.target.closest('.mobile-filter-btn')) {
        if (window.mobileFilterDrawer) {
            window.mobileFilterDrawer.open();
        }
    }
});

// Export for global use
window.HapticFeedback = HapticFeedback;
