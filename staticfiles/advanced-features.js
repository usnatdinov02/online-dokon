// ==========================================
// MERCEDES-BENZ - ADVANCED FEATURES
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== DARK MODE ==========
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    darkModeToggle.style.cssText = `
        position: fixed;
        bottom: 90px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(darkModeToggle);
    
    // Check saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        
        // Animate transition
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    });
    
    darkModeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px) rotate(20deg)';
    });
    
    darkModeToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0)';
    });
    
    
    // ========== PRODUCT RATING STARS ==========
    function addRatingStars() {
        document.querySelectorAll('.product-card, .category-card').forEach(card => {
            const cardBody = card.querySelector('.card-body');
            if (cardBody && !cardBody.querySelector('.product-rating')) {
                const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
                const ratingDiv = document.createElement('div');
                ratingDiv.className = 'product-rating';
                ratingDiv.style.cssText = 'margin: 0.5rem 0; color: #fbbf24;';
                
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    starsHTML += i <= rating 
                        ? '<i class="fas fa-star"></i>' 
                        : '<i class="far fa-star"></i>';
                }
                ratingDiv.innerHTML = starsHTML + ` <span style="color: #6b7280; font-size: 0.875rem;">(${Math.floor(Math.random() * 50) + 10})</span>`;
                
                const title = cardBody.querySelector('.card-title');
                if (title) {
                    title.after(ratingDiv);
                }
            }
        });
    }
    addRatingStars();
    
    
    // ========== IMAGE ZOOM ON HOVER ==========
    const productImages = document.querySelectorAll('#main-image');
    productImages.forEach(img => {
        const container = img.parentElement;
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        const zoomLens = document.createElement('div');
        zoomLens.className = 'zoom-lens';
        zoomLens.style.cssText = `
            position: absolute;
            width: 100px;
            height: 100px;
            border: 2px solid white;
            border-radius: 50%;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s;
            box-shadow: 0 0 20px rgba(0,0,0,0.3);
            z-index: 10;
        `;
        container.appendChild(zoomLens);
        
        container.addEventListener('mouseenter', function() {
            img.style.transform = 'scale(1.5)';
            img.style.transition = 'transform 0.3s ease';
            zoomLens.style.opacity = '1';
        });
        
        container.addEventListener('mouseleave', function() {
            img.style.transform = 'scale(1)';
            zoomLens.style.opacity = '0';
        });
        
        container.addEventListener('mousemove', function(e) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            zoomLens.style.left = (x - 50) + 'px';
            zoomLens.style.top = (y - 50) + 'px';
            
            const xPercent = (x / rect.width) * 100;
            const yPercent = (y / rect.height) * 100;
            img.style.transformOrigin = `${xPercent}% ${yPercent}%`;
        });
    });
    
    
    // ========== SHARE BUTTONS ==========
    const productDetails = document.querySelector('.product-details');
    if (productDetails) {
        const shareButtons = document.createElement('div');
        shareButtons.className = 'share-buttons';
        shareButtons.style.cssText = 'margin-top: 1rem; display: flex; gap: 0.5rem; flex-wrap: wrap;';
        shareButtons.innerHTML = `
            <button class="btn btn-sm btn-outline-primary share-btn" data-platform="facebook">
                <i class="fab fa-facebook-f"></i> Share
            </button>
            <button class="btn btn-sm btn-outline-info share-btn" data-platform="twitter">
                <i class="fab fa-twitter"></i> Tweet
            </button>
            <button class="btn btn-sm btn-outline-success share-btn" data-platform="whatsapp">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button class="btn btn-sm btn-outline-secondary share-btn" data-platform="copy">
                <i class="fas fa-link"></i> Copy Link
            </button>
        `;
        productDetails.appendChild(shareButtons);
        
        document.querySelectorAll('.share-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const platform = this.dataset.platform;
                const url = window.location.href;
                const title = document.querySelector('.product-title')?.textContent || 'Mercedes-Benz Product';
                
                let shareUrl;
                switch(platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                        break;
                    case 'whatsapp':
                        shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
                        break;
                    case 'copy':
                        navigator.clipboard.writeText(url);
                        this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                            this.innerHTML = '<i class="fas fa-link"></i> Copy Link';
                        }, 2000);
                        return;
                }
                
                if (shareUrl) {
                    window.open(shareUrl, '_blank', 'width=600,height=400');
                }
            });
        });
    }
    
    
    // ========== PRICE RANGE FILTER ==========
    const filterSection = document.querySelector('.row.mb-4');
    if (filterSection) {
        const priceFilterDiv = document.createElement('div');
        priceFilterDiv.className = 'col-md-12 mt-3';
        priceFilterDiv.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <h6 class="mb-3">Narx oralig'i</h6>
                    <div class="price-range-slider">
                        <input type="range" id="minPrice" min="0" max="100000" value="0" step="1000">
                        <input type="range" id="maxPrice" min="0" max="100000" value="100000" step="1000">
                        <div class="price-values">
                            <span>$<span id="minValue">0</span></span>
                            <span>$<span id="maxValue">100000</span></span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        filterSection.appendChild(priceFilterDiv);
        
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');
        const minValue = document.getElementById('minValue');
        const maxValue = document.getElementById('maxValue');
        
        minPrice?.addEventListener('input', function() {
            minValue.textContent = this.value;
            filterProducts();
        });
        
        maxPrice?.addEventListener('input', function() {
            maxValue.textContent = this.value;
            filterProducts();
        });
        
        function filterProducts() {
            const min = parseInt(minPrice.value);
            const max = parseInt(maxPrice.value);
            
            document.querySelectorAll('.product-card').forEach(card => {
                const priceText = card.querySelector('strong')?.textContent;
                const price = parseFloat(priceText?.replace('$', '').replace(',', ''));
                
                if (price && (price < min || price > max)) {
                    card.parentElement.style.display = 'none';
                } else {
                    card.parentElement.style.display = 'block';
                }
            });
        }
    }
    
    
    // ========== QUICK VIEW MODAL ==========
    const quickViewModal = document.createElement('div');
    quickViewModal.className = 'modal fade';
    quickViewModal.id = 'quickViewModal';
    quickViewModal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Tez ko'rish</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6">
                            <img id="quickViewImage" src="" class="img-fluid rounded" alt="">
                        </div>
                        <div class="col-md-6">
                            <h4 id="quickViewTitle"></h4>
                            <div id="quickViewRating" class="mb-3"></div>
                            <h3 id="quickViewPrice" class="text-primary mb-3"></h3>
                            <p id="quickViewDescription"></p>
                            <button class="btn btn-primary btn-lg w-100">
                                <i class="fas fa-cart-plus"></i> Savatchaga qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(quickViewModal);
    
    // Add quick view buttons to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const btnContainer = card.querySelector('.d-flex');
        if (btnContainer) {
            const quickViewBtn = document.createElement('button');
            quickViewBtn.className = 'btn btn-outline-secondary btn-sm';
            quickViewBtn.innerHTML = '<i class="fas fa-eye"></i>';
            quickViewBtn.title = 'Tez ko\'rish';
            quickViewBtn.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: 2; border-radius: 50%; width: 40px; height: 40px; padding: 0;';
            
            const imageContainer = card.querySelector('.card-img-top')?.parentElement;
            if (imageContainer) {
                imageContainer.style.position = 'relative';
                imageContainer.appendChild(quickViewBtn);
            }
            
            quickViewBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const img = card.querySelector('.card-img-top')?.src;
                const title = card.querySelector('.card-title')?.textContent;
                const price = card.querySelector('strong')?.textContent;
                const description = card.querySelector('.card-text')?.textContent;
                const rating = card.querySelector('.product-rating')?.innerHTML;
                
                document.getElementById('quickViewImage').src = img;
                document.getElementById('quickViewTitle').textContent = title;
                document.getElementById('quickViewPrice').textContent = price;
                document.getElementById('quickViewDescription').textContent = description;
                document.getElementById('quickViewRating').innerHTML = rating || '';
                
                const modal = new bootstrap.Modal(document.getElementById('quickViewModal'));
                modal.show();
            });
        }
    });
    
    
    // ========== NEWSLETTER SUBSCRIPTION ==========
    const footer = document.querySelector('footer');
    if (footer) {
        const newsletter = document.createElement('div');
        newsletter.className = 'newsletter-section';
        newsletter.style.cssText = 'background: linear-gradient(135deg, #667eea, #764ba2); padding: 2rem 0; margin-top: 2rem;';
        newsletter.innerHTML = `
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6 text-white mb-3 mb-md-0">
                        <h4><i class="fas fa-envelope me-2"></i>Yangiliklar uchun obuna bo'ling</h4>
                        <p class="mb-0">Maxsus takliflar va chegirmalardan xabardor bo'ling</p>
                    </div>
                    <div class="col-md-6">
                        <form id="newsletterForm" class="d-flex gap-2">
                            <input type="email" class="form-control" placeholder="Email manzilingiz" required>
                            <button type="submit" class="btn btn-light">
                                <i class="fas fa-paper-plane"></i> Obuna
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        `;
        footer.before(newsletter);
        
        document.getElementById('newsletterForm')?.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            showToast('Obuna muvaffaqiyatli! ' + email, 'success');
            this.reset();
        });
    }
    
    
    // ========== PRODUCT COMPARISON ==========
    let comparisonList = JSON.parse(localStorage.getItem('comparison')) || [];
    
    const comparisonBar = document.createElement('div');
    comparisonBar.className = 'comparison-bar';
    comparisonBar.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 -5px 20px rgba(0,0,0,0.1);
        padding: 1rem;
        z-index: 999;
        display: none;
        transform: translateY(100%);
        transition: transform 0.3s ease;
    `;
    comparisonBar.innerHTML = `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>Taqqoslash:</strong>
                    <span id="comparisonCount">0</span> ta mahsulot tanlandi
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-primary" id="compareBtn">
                        <i class="fas fa-balance-scale"></i> Taqqoslash
                    </button>
                    <button class="btn btn-outline-secondary" id="clearComparisonBtn">
                        <i class="fas fa-times"></i> Tozalash
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(comparisonBar);
    
    function updateComparisonBar() {
        document.getElementById('comparisonCount').textContent = comparisonList.length;
        if (comparisonList.length > 0) {
            comparisonBar.style.display = 'block';
            setTimeout(() => {
                comparisonBar.style.transform = 'translateY(0)';
            }, 10);
        } else {
            comparisonBar.style.transform = 'translateY(100%)';
            setTimeout(() => {
                comparisonBar.style.display = 'none';
            }, 300);
        }
        localStorage.setItem('comparison', JSON.stringify(comparisonList));
    }
    
    // Add compare checkbox to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        const compareCheckbox = document.createElement('div');
        compareCheckbox.className = 'form-check';
        compareCheckbox.style.cssText = 'position: absolute; top: 10px; left: 60px; z-index: 2;';
        compareCheckbox.innerHTML = `
            <input class="form-check-input compare-checkbox" type="checkbox" id="compare-${Math.random()}">
            <label class="form-check-label" style="background: white; padding: 0.25rem 0.5rem; border-radius: 5px;">
                Taqqoslash
            </label>
        `;
        
        const imageContainer = card.querySelector('.card-img-top')?.parentElement;
        if (imageContainer) {
            imageContainer.style.position = 'relative';
            imageContainer.appendChild(compareCheckbox);
        }
        
        const checkbox = compareCheckbox.querySelector('input');
        checkbox?.addEventListener('change', function() {
            const productId = card.dataset.productId || Math.random().toString();
            const productData = {
                id: productId,
                title: card.querySelector('.card-title')?.textContent,
                price: card.querySelector('strong')?.textContent,
                image: card.querySelector('.card-img-top')?.src
            };
            
            if (this.checked) {
                if (comparisonList.length < 4) {
                    comparisonList.push(productData);
                } else {
                    this.checked = false;
                    showToast('Maksimal 4 ta mahsulotni taqqoslash mumkin!', 'error');
                }
            } else {
                comparisonList = comparisonList.filter(item => item.id !== productId);
            }
            updateComparisonBar();
        });
    });
    
    document.getElementById('clearComparisonBtn')?.addEventListener('click', function() {
        comparisonList = [];
        document.querySelectorAll('.compare-checkbox').forEach(cb => cb.checked = false);
        updateComparisonBar();
    });
    
    updateComparisonBar();
    
    
    console.log('✨ Advanced features loaded successfully!');
});
