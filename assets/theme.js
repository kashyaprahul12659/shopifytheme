// Theme JS for ShreeRamPremium

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initMobileMenu();
  initQuantitySelectors();
  initProductImageGallery();
  initTestimonialSlider();
  initProductForm();
  initAnimations();
  initHeaderScrollEffect();
});

// Cart drawer functionality
function initCartDrawer() {
  const cartToggle = document.querySelectorAll('.js-cart-drawer-trigger');
  const cartDrawer = document.getElementById('CartDrawer');
  const cartDrawerOverlay = document.getElementById('CartDrawerOverlay');
  const cartDrawerClose = document.querySelector('.js-cart-drawer-close');
  
  if (!cartDrawer) return;
  
  cartToggle.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      openCartDrawer();
    });
  });
  
  if (cartDrawerClose) {
    cartDrawerClose.addEventListener('click', closeCartDrawer);
  }
  
  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  }
  
  function openCartDrawer() {
    cartDrawer.classList.add('active');
    cartDrawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeCartDrawer() {
    cartDrawer.classList.remove('active');
    cartDrawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Handle Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeCartDrawer();
    }
  });
}

// Mobile menu functionality
function initMobileMenu() {
  const menuToggle = document.querySelector('.js-mobile-menu-toggle');
  const mobileMenu = document.querySelector('.js-mobile-menu');
  const mobileMenuClose = document.querySelector('.js-mobile-menu-close');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }
  
  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  // Handle Escape key
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeMobileMenu();
    }
  });
}

// Quantity selectors functionality
function initQuantitySelectors() {
  const quantitySelectors = document.querySelectorAll('.js-quantity-selector');
  
  quantitySelectors.forEach(selector => {
    const decreaseBtn = selector.querySelector('.js-quantity-decrease');
    const increaseBtn = selector.querySelector('.js-quantity-increase');
    const input = selector.querySelector('.js-quantity-input');
    
    if (!decreaseBtn || !increaseBtn || !input) return;
    
    decreaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value, 10);
      if (currentValue > 1) {
        input.value = currentValue - 1;
        input.dispatchEvent(new Event('change'));
      }
    });
    
    increaseBtn.addEventListener('click', () => {
      const currentValue = parseInt(input.value, 10);
      input.value = currentValue + 1;
      input.dispatchEvent(new Event('change'));
    });
  });
}

// Product image gallery
function initProductImageGallery() {
  const galleries = document.querySelectorAll('.js-product-gallery');
  
  galleries.forEach(gallery => {
    const mainImage = gallery.querySelector('.js-main-image');
    const thumbnails = gallery.querySelectorAll('.js-thumbnail');
    
    if (!mainImage || thumbnails.length === 0) return;
    
    thumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        // Update main image
        mainImage.src = thumbnail.dataset.fullsize;
        mainImage.srcset = thumbnail.dataset.fullsize;
        
        // Update active state
        thumbnails.forEach(t => t.classList.remove('active'));
        thumbnail.classList.add('active');
      });
    });
  });
}

// Testimonial slider
function initTestimonialSlider() {
  const sliders = document.querySelectorAll('.js-testimonial-slider');
  
  sliders.forEach(slider => {
    const container = slider.querySelector('.testimonials__container');
    const items = slider.querySelectorAll('.testimonial-item');
    const prevBtn = slider.querySelector('.js-testimonial-prev');
    const nextBtn = slider.querySelector('.js-testimonial-next');
    
    if (!container || !items.length) return;
    
    let currentIndex = 0;
    
    function goToSlide(index) {
      if (index < 0) {
        index = items.length - 1;
      } else if (index >= items.length) {
        index = 0;
      }
      
      currentIndex = index;
      const translateValue = -100 * currentIndex;
      container.style.transform = `translateX(${translateValue}%)`;
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
      });
    }
    
    // Auto slide
    let interval = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 5000);
    
    // Pause on hover
    slider.addEventListener('mouseenter', () => {
      clearInterval(interval);
    });
    
    slider.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 5000);
    });
  });
}

// Product form handling
function initProductForm() {
  const forms = document.querySelectorAll('.js-product-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const submitBtn = form.querySelector('[type="submit"]');
      
      if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;
      }
      
      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          body: formData
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Update cart drawer and open it
          updateCartDrawer();
          
          const cartDrawer = document.getElementById('CartDrawer');
          const cartDrawerOverlay = document.getElementById('CartDrawerOverlay');
          
          if (cartDrawer && cartDrawerOverlay) {
            cartDrawer.classList.add('active');
            cartDrawerOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        } else {
          console.error('Error adding to cart:', data);
          alert('Error adding product to cart: ' + (data.description || 'Please try again'));
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding product to cart. Please try again.');
      }
      
      if (submitBtn) {
        submitBtn.textContent = 'Added!';
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 2000);
      }
    });
  });
}

// Update cart drawer
async function updateCartDrawer() {
  const cartContent = document.querySelector('.js-cart-drawer-content');
  if (!cartContent) return;
  
  cartContent.innerHTML = '<div class="cart-drawer__loading">Loading cart...</div>';
  
  try {
    const response = await fetch('/cart.js');
    const cart = await response.json();
    
    if (cart.item_count === 0) {
      cartContent.innerHTML = `
        <div class="cart-drawer__empty">
          <p>Your cart is empty</p>
          <p><a href="/collections/all" class="btn btn--secondary">Continue Shopping</a></p>
        </div>
      `;
      return;
    }
    
    let cartItemsHTML = '';
    
    cart.items.forEach(item => {
      const image = item.image ? item.image.replace(/(\.[^.]*)$/, "_small$1") : '';
      
      cartItemsHTML += `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item__image-wrapper">
            <img class="cart-item__image" src="${image}" alt="${item.title}" loading="lazy" width="80">
          </div>
          <div class="cart-item__details">
            <h4 class="cart-item__title">${item.title}</h4>
            ${item.variant_title ? `<p class="cart-item__variant">${item.variant_title}</p>` : ''}
            <div class="cart-item__price-quantity">
              <div class="cart-item__quantity js-quantity-selector">
                <button class="cart-item__quantity-btn js-quantity-decrease" type="button">-</button>
                <input class="cart-item__quantity-input js-quantity-input" type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                <button class="cart-item__quantity-btn js-quantity-increase" type="button">+</button>
              </div>
              <div class="cart-item__price">${formatMoney(item.line_price)}</div>
            </div>
            <button class="cart-item__remove js-remove-item" type="button" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    });
    
    const subtotal = formatMoney(cart.total_price);
    
    cartContent.innerHTML = `
      <div class="cart-drawer__items">
        ${cartItemsHTML}
      </div>
    `;
    
    const footer = document.querySelector('.js-cart-drawer-footer');
    if (footer) {
      footer.innerHTML = `
        <div class="cart-drawer__subtotal">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div class="cart-drawer__buttons">
          <a href="/checkout" class="btn">Checkout</a>
          <button type="button" class="btn btn--secondary js-cart-drawer-close">Continue Shopping</button>
        </div>
      `;
    }
    
    // Re-initialize quantity selectors
    initQuantitySelectors();
    
    // Attach remove item events
    const removeButtons = document.querySelectorAll('.js-remove-item');
    removeButtons.forEach(button => {
      button.addEventListener('click', async () => {
        const id = button.dataset.id;
        await updateCartItem(id, 0);
      });
    });
    
    // Attach quantity change events
    const quantityInputs = document.querySelectorAll('.js-quantity-input');
    quantityInputs.forEach(input => {
      input.addEventListener('change', async () => {
        const id = input.dataset.id;
        const quantity = parseInt(input.value, 10);
        if (quantity >= 1) {
          await updateCartItem(id, quantity);
        }
      });
    });
    
  } catch (error) {
    console.error('Error updating cart:', error);
    cartContent.innerHTML = '<div class="cart-drawer__error">Error loading cart. Please refresh the page.</div>';
  }
}

// Update cart item
async function updateCartItem(id, quantity) {
  try {
    const response = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, quantity }),
    });
    
    if (response.ok) {
      updateCartDrawer();
    } else {
      console.error('Error updating cart item:', await response.json());
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
  }
}

// Format money
function formatMoney(cents) {
  const amount = cents / 100;
  return '$' + amount.toFixed(2);
}

// Scroll animations
function initAnimations() {
  if ('IntersectionObserver' in window) {
    const fadeElements = document.querySelectorAll('.js-fade-in');
    const slideElements = document.querySelectorAll('.js-slide-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-in-up');
          slideObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
    slideElements.forEach(el => slideObserver.observe(el));
  }
}

// Header scroll effect
function initHeaderScrollEffect() {
  const header = document.querySelector('.js-header');
  if (!header) return;
  
  let lastScrollTop = 0;
  
  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
      header.classList.add('site-header--scrolled');
      
      if (scrollTop > lastScrollTop) {
        // Scrolling down
        header.classList.add('site-header--hidden');
      } else {
        // Scrolling up
        header.classList.remove('site-header--hidden');
      }
    } else {
      header.classList.remove('site-header--scrolled');
      header.classList.remove('site-header--hidden');
    }
    
    lastScrollTop = scrollTop;
  });
}
