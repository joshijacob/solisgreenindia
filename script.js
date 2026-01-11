// =========================================================
// SOLIS GREEN INDIA - UNIVERSAL JAVASCRIPT
// Version: 4.0 | Compatible with ALL Pages
// =========================================================

// CONFIGURATION - Centralized Settings
const CONFIG = {
  // Form Submission
  FORMSUBMIT_URL: 'https://formsubmit.co/ajax/solisgreenindia@gmail.com',
  WHATSAPP_NUMBER: '918301849474',
  
  // Animations & Timing
  SLIDE_INTERVAL_MS: 5000,
  NOTIFICATION_DURATION: 5000,
  
  // Thresholds
  SCROLL_THRESHOLD: 300,
  DEBOUNCE_WAIT: 10,
  
  // Page Tracking
  PAGE_NAMES: {
    '/': 'Homepage',
    '/index.html': 'Homepage',
    '/services/': 'Services',
    '/cities/': 'Service Areas',
    '/about/': 'About',
    '/projects/': 'Projects',
    '/contact/': 'Contact'
  }
};

// =========================================================
// 1. UTILITY FUNCTIONS
// =========================================================

// Debounce for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smart Page Type Detection
function detectPageType() {
  const path = window.location.pathname;
  
  // Check for homepage
  if (path === '/' || path === '/index.html' || path === '') return 'homepage';
  
  // Check for district pages
  if (path.includes('/solar-company-in-')) {
    const parts = path.split('/').filter(p => p);
    return parts.length > 1 ? 'city' : 'district';
  }
  
  // Check for city pages
  if (path.includes('/cities/') || path.includes('/town/')) return 'city';
  
  // Check other main pages
  if (path.includes('/services/')) return 'service';
  if (path.includes('/about/')) return 'about';
  if (path.includes('/projects/')) return 'projects';
  if (path.includes('/contact/')) return 'contact';
  
  return 'general';
}

// Enhanced Tracking
function trackEvent(category, action, label, value = null) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Facebook Pixel (if exists)
  if (typeof fbq !== 'undefined') {
    fbq('trackCustom', action, {
      category: category,
      label: label,
      value: value
    });
  }
  
  // Console log for debugging
  console.log(`📊 Event: ${category} - ${action} - ${label}`, value || '');
}

// =========================================================
// 2. CORE INITIALIZATION
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Solis Green India - Universal JS Initializing...');
  
  // Detect page type
  const pageType = detectPageType();
  console.log(`📄 Page Type Detected: ${pageType}`);
  
  // Initialize CORE features (all pages)
  initializeMobileMenu();
  initializeForms();
  initializeScrollElements();
  initializeStickyContactBar();
  initializeSmoothScroll();
  initializeModals();
  initializeTracking();
  
  // Initialize CONDITIONAL features
  initializeConditionalFeatures(pageType);
  
  // Page-specific initialization
  initializePageSpecificFeatures(pageType);
  
  // Track page view
  trackPageView(pageType);
  
  console.log('✅ Solis Green India - Initialization Complete');
});

// =========================================================
// 3. CORE MODULES (ALL PAGES)
// =========================================================

// MOBILE MENU - Works with both header structures
function initializeMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn') || 
                  document.querySelector('#mobileMenuBtn');
  
  // Try new structure first, then legacy
  const mainNav = document.querySelector('.header-menu') || 
                  document.querySelector('#mainNav') ||
                  document.querySelector('nav ul');
  
  if (!menuBtn || !mainNav) {
    console.warn('⚠️ Mobile menu elements not found');
    return;
  }
  
  // Toggle Menu
  menuBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isActive = mainNav.classList.toggle('active');
    this.setAttribute('aria-expanded', isActive);
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = isActive ? 'hidden' : '';
    
    trackEvent('Navigation', 'mobile_menu_toggle', isActive ? 'open' : 'close');
  });
  
  // Close menu on link click
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
  
  // Close menu on outside click
  document.addEventListener('click', function(event) {
    if (mainNav.classList.contains('active') && 
        !mainNav.contains(event.target) && 
        !menuBtn.contains(event.target)) {
      mainNav.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mainNav.classList.contains('active')) {
      mainNav.classList.remove('active');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// FORM HANDLING - All form types
function initializeForms() {
  // Handle all form variations
  const forms = document.querySelectorAll(
    '.quick-quote-form, ' +
    '.town-quote-form, ' +
    '#mainQuoteForm, ' +
    '#modalQuoteForm, ' +
    'form[action*="formsubmit"]'
  );
  
  if (forms.length === 0) {
    console.log('ℹ️ No forms found on this page');
    return;
  }
  
  forms.forEach(form => {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate form
      if (!validateForm(this)) {
        showNotification('Please fill all required fields correctly.', 'error');
        return;
      }
      
      // Get form data
      const formData = new FormData(this);
      const data = {
        name: formData.get('name') || '',
        phone: formData.get('phone') || '',
        email: formData.get('email') || '',
        service: formData.get('service') || 'Not specified',
        location: formData.get('location') || detectLocationFromPage(),
        message: formData.get('message') || '',
        page: window.location.pathname,
        timestamp: new Date().toLocaleString('en-IN'),
        source: 'Website Form'
      };
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      try {
        // Show loading state
        setButtonLoading(submitBtn, true, originalText);
        
        // Submit to FormSubmit
        const success = await submitToFormSubmit(data, this);
        
        if (success) {
          handleFormSuccess(submitBtn, originalText, this, data);
        } else {
          // Fallback to WhatsApp
          fallbackToWhatsApp(data);
          setButtonLoading(submitBtn, false, originalText);
        }
      } catch (error) {
        console.error('Form submission error:', error);
        fallbackToWhatsApp(data);
        setButtonLoading(submitBtn, false, originalText);
      }
    });
    
    // Real-time validation
    form.querySelectorAll('input, select, textarea').forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => clearFieldError(input));
    });
  });
}

// SCROLL ELEMENTS
function initializeScrollElements() {
  const backToTopBtn = document.getElementById('backToTop');
  
  // Back to Top button
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      trackEvent('Navigation', 'back_to_top', 'click');
    });
    
    // Show/hide on scroll
    window.addEventListener('scroll', debounce(() => {
      const isVisible = window.pageYOffset > CONFIG.SCROLL_THRESHOLD;
      backToTopBtn.classList.toggle('show', isVisible);
      backToTopBtn.setAttribute('aria-hidden', !isVisible);
    }, CONFIG.DEBOUNCE_WAIT));
  }
  
  // Scroll animations
  const animatedElements = document.querySelectorAll(
    '.service-card, .district-card, .area-card, ' +
    '.feature-item, .testimonial-card, .project-card'
  );
  
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    animatedElements.forEach(element => {
      element.classList.add('animate-hidden');
      observer.observe(element);
    });
  }
}

// STICKY CONTACT BAR
function initializeStickyContactBar() {
  const stickyBar = document.querySelector('.sticky-contact-bar');
  if (!stickyBar) return;
  
  // Track clicks
  stickyBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      const action = this.classList.contains('sticky-call') ? 'call' : 'whatsapp';
      trackEvent('Mobile', `sticky_${action}`, 'Sticky Contact Bar');
    });
  });
  
  // Hide on scroll down (mobile only)
  if (window.innerWidth <= 768) {
    let lastScrollTop = 0;
    window.addEventListener('scroll', debounce(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 100) {
        stickyBar.style.transform = 'translateY(100%)';
      } else {
        stickyBar.style.transform = 'translateY(0)';
      }
      lastScrollTop = scrollTop;
    }, 100));
  }
}

// SMOOTH SCROLL
function initializeSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerHeight = document.querySelector('.solis-header')?.offsetHeight || 80;
        
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const mainNav = document.querySelector('.header-menu.active') || 
                       document.querySelector('#mainNav.active');
        if (mainNav) {
          mainNav.classList.remove('active');
          document.querySelector('.mobile-menu-btn')?.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
        
        trackEvent('Navigation', 'smooth_scroll', targetId);
      }
    });
  });
}

// MODALS
function initializeModals() {
  const modals = document.querySelectorAll('.modal');
  if (modals.length === 0) return;
  
  // Close modals on click outside or close button
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });
  
  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });
}

// TRACKING
function initializeTracking() {
  // Track phone clicks
  document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
      const phoneNumber = this.getAttribute('href').replace('tel:', '');
      trackEvent('Contact', 'phone_call', phoneNumber);
    });
  });
  
  // Track WhatsApp clicks
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('Contact', 'whatsapp_click', this.textContent.trim());
    });
  });
  
  // Track CTA button clicks
  document.querySelectorAll('.cta-button, .btn-primary, .btn-whatsapp').forEach(button => {
    button.addEventListener('click', function() {
      trackEvent('CTA', 'button_click', this.textContent.trim());
    });
  });
  
  // Track external links
  document.querySelectorAll('a[href^="http"]:not([href*="solisgreenindia.in"])').forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('External', 'link_click', this.href);
    });
  });
}

// =========================================================
// 4. CONDITIONAL FEATURES
// =========================================================

function initializeConditionalFeatures(pageType) {
  // Hero Slider (if exists)
  if (document.querySelector('.hero-slider')) {
    initializeHeroSlider();
  }
  
  // Floating CTA (if exists)
  if (document.querySelector('.floating-cta')) {
    initializeFloatingCTA();
  }
  
  // Emergency Contact (if exists)
  if (document.querySelector('.emergency-contact')) {
    initializeEmergencyContact();
  }
  
  // Financial Calculators (District pages)
  if (pageType === 'district' || document.querySelector('.financial-benefits')) {
    initializeFinancialCalculators();
  }
  
  // EMI Calculator (City pages)
  if (pageType === 'city' || document.getElementById('emiCalcBtn')) {
    initializeEMICalculator();
  }
}

// HERO SLIDER
function initializeHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const slider = document.querySelector('.hero-slider');
  
  if (slides.length === 0 || !slider) return;
  
  let currentSlide = 0;
  let slideInterval;
  
  const showSlide = (index) => {
    currentSlide = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  };
  
  const nextSlide = () => showSlide(currentSlide + 1);
  const prevSlide = () => showSlide(currentSlide - 1);
  
  const startAutoSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, CONFIG.SLIDE_INTERVAL_MS);
  };
  
  const stopAutoSlide = () => clearInterval(slideInterval);
  
  // Event Listeners
  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });
  
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => { showSlide(index); stopAutoSlide(); startAutoSlide(); });
  });
  
  slider.addEventListener('mouseenter', stopAutoSlide);
  slider.addEventListener('mouseleave', startAutoSlide);
  
  // Initialize
  showSlide(0);
  startAutoSlide();
}

// FLOATING CTA
function initializeFloatingCTA() {
  const ctaMainBtn = document.getElementById('ctaMainBtn');
  const quickFormBtn = document.getElementById('quickFormBtn');
  const ctaOptions = document.querySelector('.cta-options');
  
  if (!ctaMainBtn || !ctaOptions) return;
  
  // Toggle CTA Options
  ctaMainBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    ctaOptions.classList.toggle('active');
    trackEvent('CTA', 'floating_menu_toggle', ctaOptions.classList.contains('active') ? 'open' : 'close');
  });
  
  // Quick Form Button
  if (quickFormBtn) {
    quickFormBtn.addEventListener('click', function(e) {
      e.preventDefault();
      openModal('quickQuoteModal');
      ctaOptions.classList.remove('active');
      trackEvent('CTA', 'quick_quote_modal', 'Floating CTA');
    });
  }
  
  // Close CTA options when clicking outside
  document.addEventListener('click', function(event) {
    if (ctaOptions.classList.contains('active') && 
        !ctaOptions.contains(event.target) &&
        !ctaMainBtn.contains(event.target)) {
      ctaOptions.classList.remove('active');
    }
  });
}

// =========================================================
// 5. PAGE-SPECIFIC FEATURES
// =========================================================

function initializePageSpecificFeatures(pageType) {
  switch(pageType) {
    case 'homepage':
      initializeHomepageFeatures();
      break;
    case 'district':
      initializeDistrictFeatures();
      break;
    case 'city':
      initializeCityFeatures();
      break;
    case 'service':
      initializeServiceFeatures();
      break;
    case 'projects':
      initializeProjectsFeatures();
      break;
    case 'about':
      initializeAboutFeatures();
      break;
    case 'contact':
      initializeContactFeatures();
      break;
  }
}

// HOMEPAGE FEATURES
function initializeHomepageFeatures() {
  // Homepage-specific tracking
  trackEvent('Page', 'view', 'Homepage');
  
  // Initialize particle effects if present
  if (document.querySelector('.particles-container')) {
    // Particle animations can be added here
  }
  
  // Special homepage interactions
  const districtCards = document.querySelectorAll('.district-card');
  districtCards.forEach(card => {
    card.addEventListener('click', function() {
      const districtName = this.querySelector('h3').textContent;
      trackEvent('Homepage', 'district_card_click', districtName);
    });
  });
}

// DISTRICT PAGE FEATURES
function initializeDistrictFeatures() {
  const districtName = document.querySelector('.town-hero h1, .district-hero h1')?.textContent || 
                       'Unknown District';
  
  trackEvent('Page', 'view', `District: ${districtName}`);
  
  // Town card interactions
  const townCards = document.querySelectorAll('.service-card[href*="town"]');
  townCards.forEach(card => {
    card.addEventListener('click', function(e) {
      if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
        const townName = this.querySelector('h3').textContent;
        trackEvent('District', 'town_card_click', `${districtName} - ${townName}`);
      }
    });
  });
}

// CITY PAGE FEATURES
function initializeCityFeatures() {
  const cityName = document.querySelector('.town-hero h1')?.textContent || 
                   document.title.split('|')[0]?.trim() || 
                   'Unknown City';
  
  trackEvent('Page', 'view', `City: ${cityName}`);
  
  // Nearby cities links
  const nearbyLinks = document.querySelectorAll('.city-links a');
  nearbyLinks.forEach(link => {
    link.addEventListener('click', function() {
      trackEvent('City', 'nearby_city_click', this.textContent);
    });
  });
}

// SERVICE PAGE FEATURES
function initializeServiceFeatures() {
  const serviceName = document.querySelector('h1')?.textContent || 'Unknown Service';
  trackEvent('Page', 'view', `Service: ${serviceName}`);
  
  // Service feature accordions
  const accordions = document.querySelectorAll('.feature-accordion');
  accordions.forEach(accordion => {
    accordion.addEventListener('click', function() {
      this.classList.toggle('active');
      trackEvent('Service', 'accordion_toggle', serviceName);
    });
  });
}

// PROJECTS PAGE FEATURES
function initializeProjectsFeatures() {
  trackEvent('Page', 'view', 'Projects Gallery');
  
  // Project gallery interactions
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach((card, index) => {
    card.addEventListener('click', function() {
      const projectTitle = this.querySelector('h3')?.textContent || `Project ${index + 1}`;
      trackEvent('Projects', 'project_view', projectTitle);
      
      // Could open lightbox here
    });
  });
  
  // Project filtering (if implemented)
  const filterButtons = document.querySelectorAll('.project-filter');
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const filterType = this.getAttribute('data-filter') || 'all';
      trackEvent('Projects', 'filter', filterType);
    });
  });
}

// ABOUT PAGE FEATURES
function initializeAboutFeatures() {
  trackEvent('Page', 'view', 'About Us');
  
  // Team member interactions
  const teamCards = document.querySelectorAll('.team-card');
  teamCards.forEach(card => {
    card.addEventListener('click', function() {
      const memberName = this.querySelector('h4')?.textContent || 'Team Member';
      trackEvent('About', 'team_member_view', memberName);
    });
  });
}

// CONTACT PAGE FEATURES
function initializeContactFeatures() {
  trackEvent('Page', 'view', 'Contact');
  
  // Map interaction tracking
  const mapIframe = document.querySelector('iframe[src*="google.com/maps"]');
  if (mapIframe) {
    mapIframe.addEventListener('load', function() {
      trackEvent('Contact', 'map_loaded', 'Google Maps');
    });
  }
  
  // Contact form special handling
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function() {
      trackEvent('Contact', 'form_submit', 'Main Contact Form');
    });
  }
}

// =========================================================
// 6. FORM UTILITIES
// =========================================================

// Form Submission
async function submitToFormSubmit(data, form) {
  try {
    const formData = new FormData();
    
    // Add all data fields
    Object.keys(data).forEach(key => {
      if (data[key]) formData.append(key, data[key]);
    });
    
    // FormSubmit specific fields
    formData.append('_subject', `🔆 Solar Quote - ${data.name || 'Customer'}`);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    if (data.email) formData.append('_replyto', data.email);
    
    const actionUrl = form.action || CONFIG.FORMSUBMIT_URL;
    
    const response = await fetch(actionUrl, {
      method: 'POST',
      body: formData
    });
    
    return response.ok;
  } catch (error) {
    console.warn('FormSubmit error, falling back to WhatsApp:', error);
    return false;
  }
}

// WhatsApp Fallback
function fallbackToWhatsApp(data) {
  const message = `🔆 SOLIS GREEN INDIA - Quote Request 🔆

Name: ${data.name}
Phone: ${data.phone}
Service Needed: ${data.service}
Location: ${data.location}
Page: ${data.page}
Timestamp: ${data.timestamp}

URGENT: Please contact for solar installation quote.`;

  const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  
  window.open(whatsappUrl, '_blank');
  
  showNotification('Opening WhatsApp to send your details.', 'warning');
  trackEvent('Form', 'whatsapp_fallback', data.location || 'general');
}

// Form Success Handler
function handleFormSuccess(submitBtn, originalText, form, data) {
  submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
  showNotification('Thank you! We will contact you within 30 minutes.', 'success');
  
  // Track successful submission
  trackEvent('Conversion', 'form_success', data.location || 'general', 1.0);
  
  // Reset form after delay
  setTimeout(() => {
    form.reset();
    setButtonLoading(submitBtn, false, originalText);
    closeAllModals();
  }, 3000);
}

// Form Validation
function validateForm(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  clearFieldError(field);

  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  } else if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  } else if (field.type === 'tel' && value) {
    const phoneRegex = /^[0-9]{10}$/;
    const cleanPhone = value.replace(/\D/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      isValid = false;
      errorMessage = 'Please enter a valid 10-digit phone number';
    }
  }

  if (!isValid) {
    showFieldError(field, errorMessage);
  } else if (value) {
    markFieldSuccess(field);
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add('error');
  field.classList.remove('success');
  
  let errorElement = field.parentNode.querySelector('.field-error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    field.parentNode.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
}

function markFieldSuccess(field) {
  field.classList.remove('error');
  field.classList.add('success');
}

function clearFieldError(field) {
  field.classList.remove('error', 'success');
  const errorElement = field.parentNode.querySelector('.field-error');
  if (errorElement) {
    errorElement.remove();
  }
}

// =========================================================
// 7. UI UTILITIES
// =========================================================

// Button Loading State
function setButtonLoading(btn, isLoading, originalText) {
  if (isLoading) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    btn.classList.add('loading');
  } else {
    btn.innerHTML = originalText;
    btn.disabled = false;
    btn.classList.remove('loading');
  }
}

// Notifications
function showNotification(message, type = 'info') {
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) existingNotification.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  
  const colors = { 
    success: '#28a745', 
    error: '#dc3545', 
    info: '#17a2b8', 
    warning: '#ffc107' 
  };
  
  const icons = { 
    success: 'check-circle', 
    error: 'exclamation-triangle', 
    info: 'info-circle', 
    warning: 'exclamation-circle' 
  };

  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${icons[type]}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `;

  // Apply styles
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; 
    background: ${colors[type]}; color: white;
    padding: 15px 20px; border-radius: 5px; 
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    z-index: 10000; max-width: 400px; 
    animation: slideInRight 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Auto remove
  const autoRemove = setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, CONFIG.NOTIFICATION_DURATION);

  // Manual close
  notification.querySelector('.notification-close').addEventListener('click', () => {
    clearTimeout(autoRemove);
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  });
}

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    modal.setAttribute('aria-hidden', 'false');
    trackEvent('Modal', 'open', modalId);
  }
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(modal => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

// =========================================================
// 8. SPECIALIZED FEATURES
// =========================================================

// Financial Calculators (District pages)
function initializeFinancialCalculators() {
  const calcButtons = document.querySelectorAll('.calc-button');
  calcButtons.forEach(button => {
    button.addEventListener('click', function() {
      const calcType = this.getAttribute('data-calc') || 'savings';
      trackEvent('Calculator', `${calcType}_calculate`, 'District Page');
    });
  });
}

// EMI Calculator (City pages)
function initializeEMICalculator() {
  const emiBtn = document.getElementById('emiCalcBtn');
  if (!emiBtn) return;
  
  emiBtn.addEventListener('click', function() {
    const loanAmount = document.getElementById('loanAmount')?.value || 0;
    const loanPeriod = document.getElementById('loanPeriod')?.value || 0;
    
    // Simple EMI calculation
    if (loanAmount && loanPeriod) {
      const emi = calculateEMI(loanAmount, loanPeriod);
      const resultBox = document.getElementById('emiResult');
      
      if (resultBox) {
        resultBox.innerHTML = `
          <p><strong>Monthly EMI:</strong> ₹${emi.toFixed(0)}</p>
          <p><strong>Total Interest:</strong> ₹${(emi * loanPeriod * 12 - loanAmount).toFixed(0)}</p>
        `;
      }
      
      trackEvent('Calculator', 'emi_calculate', `Amount: ${loanAmount}, Period: ${loanPeriod}`, emi);
    }
  });
}

function calculateEMI(principal, years, rate = 6) {
  const monthlyRate = rate / 12 / 100;
  const months = years * 12;
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1);
  
  return emi;
}

// Emergency Contact
function initializeEmergencyContact() {
  const emergencyNumbers = document.querySelectorAll('.emergency-number');
  emergencyNumbers.forEach(number => {
    number.addEventListener('click', function() {
      const numberType = this.textContent.includes('Primary') ? 'primary' : 
                        this.textContent.includes('Alternate') ? 'alternate' : 'support';
      trackEvent('Emergency', 'contact_click', numberType);
    });
  });
}

// =========================================================
// 9. HELPER FUNCTIONS
// =========================================================

function detectLocationFromPage() {
  const pageType = detectPageType();
  const h1Text = document.querySelector('h1')?.textContent || '';
  
  switch(pageType) {
    case 'city':
      return h1Text.split('|')[0]?.replace('Solar Installation in', '').trim() || 
             document.title.split('|')[0]?.trim() || 'Location Unknown';
    case 'district':
      return h1Text.replace('Solar Company in', '').replace('District', '').trim() || 
             'District Location';
    default:
      return 'General Inquiry';
  }
}

function trackPageView(pageType) {
  const pageTitle = document.title;
  const pagePath = window.location.pathname;
  
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'page_view', {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath
    });
  }
  
  // Custom tracking
  trackEvent('Page', 'view', `${pageType}: ${pageTitle}`);
}

// =========================================================
// 10. SERVICE WORKER (Optional PWA)
// =========================================================

if ('serviceWorker' in navigator && window.location.hostname !== 'localhost') {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('✅ ServiceWorker registered:', registration.scope);
      })
      .catch(function(error) {
        console.log('❌ ServiceWorker registration failed:', error);
      });
  });
}

// =========================================================
// 11. ERROR HANDLING & DEBUGGING
// =========================================================

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global Error:', e.error);
  trackEvent('Error', 'javascript_error', e.message, 1);
});

// Unhandled promise rejection
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled Promise Rejection:', e.reason);
  trackEvent('Error', 'promise_rejection', e.reason.toString(), 1);
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', function() {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.startTime;
        trackEvent('Performance', 'page_load', `Load Time: ${Math.round(loadTime)}ms`, loadTime);
      }
    }, 0);
  });
}

// Export for debugging (optional)
if (typeof window !== 'undefined') {
  window.SolisGreen = {
    config: CONFIG,
    detectPageType,
    trackEvent,
    showNotification,
    openModal,
    closeAllModals
  };
}

console.log('🎯 Solis Green India JS Loaded Successfully');
