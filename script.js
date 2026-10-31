// =========================================================
// SOLIS GREEN INDIA - UNIVERSAL JAVASCRIPT
// Version: 4.0 | Compatible with ALL Pages
// =========================================================

// CONFIGURATION - Centralized Settings
const CONFIG = {
  // Form Submission
  FORMSUBMIT_URL: 'https://formsubmit.co/ajax/solisgreenindia@gmail.com',
  WHATSAPP_NUMBER: '918301849474',

  // Meta Pixel Configuration (Facebook & Instagram Ads Tracking)
  // Set your Meta Pixel ID here (e.g., '123456789012345') or pass via window.SOLIS_META_PIXEL_ID
  META_PIXEL_ID: window.SOLIS_META_PIXEL_ID || localStorage.getItem('solis_meta_pixel_id') || '',
  
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

// Enhanced Tracking with Google Analytics & Meta Pixel Standards
function trackEvent(category, action, label, value = null) {
  // Google Analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
  
  // Meta Pixel (Facebook & Instagram)
  if (typeof fbq !== 'undefined') {
    if (action === 'form_success' || category === 'Conversion') {
      fbq('track', 'Lead', {
        content_name: label || 'Solar Quote Inquiry',
        content_category: category,
        value: value || 1.0,
        currency: 'INR'
      });
    } else if (action === 'whatsapp_click' || action === 'phone_call' || category === 'Contact') {
      fbq('track', 'Contact', {
        content_name: action === 'whatsapp_click' ? 'WhatsApp Consultation' : 'Phone Call',
        content_category: label || category
      });
    } else {
      fbq('trackCustom', action, {
        category: category,
        label: label,
        value: value
      });
    }
  }
  
  // Console log for debugging
  console.log(`📊 Event: ${category} - ${action} - ${label}`, value || '');
}

// Meta Pixel Dynamic Engine
function initializeMetaPixel() {
  const pixelId = (CONFIG.META_PIXEL_ID || '').trim();
  if (!pixelId || pixelId === 'YOUR_PIXEL_ID_HERE') {
    return;
  }
  
  if (window.fbq) return; // Prevent duplicate initialization

  /* Official Meta Pixel Base Code (fbevents.js) */
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', pixelId);
  fbq('track', 'PageView');
  console.log('🎯 Meta Pixel Initialized with ID:', pixelId);
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
  initializeMetaPixel();
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
  // Handle all public lead, quote, contact, and inquiry forms across all pages
  const forms = document.querySelectorAll(
    '.quick-quote-form, ' +
    '.town-quote-form, ' +
    '.contact-form, ' +
    '.contact-form-main, ' +
    '.inquiry-form, ' +
    '.detailed-quote-form, ' +
    '#mainQuoteForm, ' +
    '#modalQuoteForm, ' +
    '#solarContactForm, ' +
    '#quoteForm, ' +
    '#contactPageForm, ' +
    '#serviceQuoteForm, ' +
    '#areasQuoteForm, ' +
    '#mundakayamQuoteForm, ' +
    '#vakathanamQuoteForm, ' +
    '#adoorQuoteForm, ' +
    '#ranniQuoteForm, ' +
    '#tvmModalQuoteForm, ' +
    '#tvmInquiryForm, ' +
    'form[action*="formsubmit"]:not(#applicationForm):not([enctype="multipart/form-data"]), ' +
    'form:not(#loginForm):not(#login-form):not(#central-login-form):not(#addComponentForm):not(#sales-form):not(#manualLeadForm):not(#applicationForm):not(#jobForm)'
  );
  
  if (forms.length === 0) {
    console.log('ℹ️ No forms found on this page');
    return;
  }
  
  forms.forEach(form => {
    form.dataset.managedByScript = "true";
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Prevent double submissions
      if (this.dataset.isSubmitting === "true") return;
      
      // Validate form
      if (!validateForm(this)) {
        showNotification('Please fill all required fields correctly.', 'error');
        return;
      }
      
      this.dataset.isSubmitting = "true";
      // Mark as captured to prevent duplicate handling
      this.dataset.firestoreCaptured = "true";
      
      // Get form data with fallback to direct DOM element inspection
      const formData = new FormData(this);
      const nameVal = formData.get('name') || formData.get('fullName') || formData.get('fullname') || 
                      this.querySelector('input[name*="name"], input[placeholder*="Name"]')?.value || '';
      const phoneVal = formData.get('phone') || formData.get('tel') || formData.get('mobile') || 
                       this.querySelector('input[type="tel"], input[name*="phone"], input[placeholder*="Phone"]')?.value || '';
      const consumerVal = formData.get('consumerNumber') || formData.get('consumer_no') || formData.get('consumerNo') || formData.get('kseb_consumer_no') || 
                          this.querySelector('input[name*="consumer"], input[placeholder*="KSEB"]')?.value || '';
      const emailVal = formData.get('email') || this.querySelector('input[type="email"], input[name*="email"]')?.value || '';
      const serviceVal = formData.get('service') || formData.get('projectType') || 
                         this.querySelector('select[name*="service"], select')?.value || 'Solar Installation';
      const locationVal = formData.get('location') || formData.get('area') || 
                          this.querySelector('select[name*="location"], select[name*="area"], input[placeholder*="Location"], input[placeholder*="Area"]')?.value || 
                          detectLocationFromPage();
      const messageVal = formData.get('message') || this.querySelector('textarea')?.value || '';

      const data = {
        name: nameVal.trim() || 'Website Visitor',
        phone: phoneVal.trim(),
        consumerNumber: consumerVal.trim(),
        email: emailVal.trim(),
        service: serviceVal.trim() || 'Solar Installation',
        location: locationVal.trim() || detectLocationFromPage(),
        message: messageVal.trim(),
        page: window.location.pathname,
        timestamp: new Date().toLocaleString('en-IN'),
        source: 'Website Form'
      };
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      try {
        // Show loading state
        setButtonLoading(submitBtn, true, originalText);
        
        // 1. Save directly to Cloud Backend Firestore collection (solis/forms/submissions)
        if (typeof saveLeadToFirestore === 'function') {
          saveLeadToFirestore(data);
        }
        
        // 2. Relay via FormSubmit email
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
  
  // Contextual Smart WhatsApp Pre-fills & Tracking
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    try {
      const currentHref = link.getAttribute('href');
      // If no pre-filled message, inject context-aware Malayalam/English text
      if (currentHref && !currentHref.includes('text=')) {
        const contextualMsg = getContextualWhatsAppMessage();
        const sep = currentHref.includes('?') ? '&' : '?';
        link.setAttribute('href', `${currentHref}${sep}text=${encodeURIComponent(contextualMsg)}`);
      }
    } catch (e) {
      console.warn('WhatsApp contextual link error:', e);
    }

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

// Form Validation - Mandatory: Customer Name, Contact Number, KSEB Consumer Number
function validateForm(form) {
  let isValid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  // Strict check on Mandatory Fields: Name, Phone, and Consumer Number
  const nameInput = form.querySelector('input[name="name"], input[name="fullName"], input[placeholder*="Name"]');
  const phoneInput = form.querySelector('input[name="phone"], input[type="tel"], input[placeholder*="Phone"]');
  const consumerInput = form.querySelector('input[name="consumerNumber"], input[name="consumer_no"], input[name="consumerNo"], input[placeholder*="KSEB"]');

  if (nameInput && !nameInput.value.trim()) {
    showFieldError(nameInput, 'Customer Name is required');
    isValid = false;
  }
  if (phoneInput) {
    const cleanPhone = phoneInput.value.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      showFieldError(phoneInput, 'Valid 10-digit Contact Number is required');
      isValid = false;
    }
  }
  if (consumerInput) {
    const cleanCons = consumerInput.value.replace(/\D/g, '');
    if (!cleanCons || cleanCons.length < 10 || cleanCons.length > 13) {
      showFieldError(consumerInput, 'KSEB Consumer Number is mandatory (10-13 digits)');
      isValid = false;
    }
  }

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  let isValid = true;
  let errorMessage = '';

  clearFieldError(field);

  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is mandatory';
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
      errorMessage = 'Please enter a valid 10-digit contact number';
    }
  } else if ((field.name === 'consumerNumber' || field.name === 'consumer_no') && value) {
    const cleanConsumer = value.replace(/\D/g, '');
    if (cleanConsumer.length < 10 || cleanConsumer.length > 13) {
      isValid = false;
      errorMessage = 'Please enter a valid 10 to 13 digit KSEB Consumer Number';
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


// =========================================================
// HEADER LOADER
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    fetch('/header.html', { cache: 'no-cache' })
      .then(response => {
        if (!response.ok) throw new Error('Header not found');
        return response.text();
      })
      .then(html => {
        headerPlaceholder.innerHTML = html;
        
        // Initialize header dependent scripts
        if (typeof initializeMobileMenu === 'function') {
          initializeMobileMenu();
        }
        
        // Highlight active link based on current path
        const path = window.location.pathname;
        let navType = 'home';
        if (path.includes('/services/') || path.includes('-kerala')) navType = 'services';
        else if (path.includes('/cities/') || path.includes('solar-company-in') || path.includes('solar-installer-near-me') || path.includes('solar-consultant-')) navType = 'cities';
        else if (path.includes('/projects/')) navType = 'projects';
        else if (path.includes('/about/')) navType = 'about';
        else if (path.includes('/careers/')) navType = 'careers';
        else if (path.includes('/contact/')) navType = 'contact';
        else if (path !== '/' && path !== '/index.html' && path !== '') navType = 'services'; // Fallback for various specific service pages
        
        const mainNav = document.getElementById('mainNav');
        if (mainNav) {
          const links = mainNav.querySelectorAll('a');
          links.forEach(link => link.classList.remove('active'));
          const activeLink = mainNav.querySelector(`a[data-nav="${navType}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      })
      .catch(err => console.error('Error loading header:', err));
  }
});

// =========================================================
// FOOTER LOADER
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    fetch('/footer.html', { cache: 'no-cache' })
      .then(response => {
        if (!response.ok) throw new Error('Footer not found');
        return response.text();
      })
      .then(html => {
        footerPlaceholder.innerHTML = html;
        // Re-initialize footer dependent scripts
        if (typeof initializeStickyContactBar === 'function') {
          initializeStickyContactBar();
        }
      })
      .catch(err => console.error('Error loading footer:', err));
  }
});

// =========================================================
// PM SURYA GHAR GLOBAL URGENCY BANNER
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname;
  const href = window.location.href;
  
  // List of paths where the banner should appear
  const allowedPaths = [
    '/',
    '/index.html',
    '/3kw-solar-system-kerala-price/',
    '/3kw-solar-system-kerala-price/index.html',
    '/5kw-solar-system-kerala-price/',
    '/5kw-solar-system-kerala-price/index.html',
    '/pm-suryaghar-subsidy-kerala/',
    '/pm-surya-ghar-subsidy-kerala/',
    '/pm-suryaghar-subsidy-kerala/index.html',
    '/pm-surya-ghar-subsidy-kerala/index.html'
  ];

  // Check if it's an allowed production path OR if we are testing locally
  const isAllowed = allowedPaths.includes(path) || 
                    allowedPaths.includes(path + '/') || 
                    href.includes('index.html') || 
                    href.includes('price') || 
                    href.includes('subsidy');

  if (isAllowed) {
    // Inject Banner HTML
    const bannerHTML = `
      <div id="pm-surya-banner">
        <p>
          ⚠️ <strong>URGENT:</strong> PM Surya Ghar Scheme officially closes on <strong>March 31, 2027</strong>. 
          <span>Time remaining:</span> <span id="pm-timer-display" class="pm-timer-box">Calculating...</span>
        </p>
        <a href="https://wa.me/918301849474?text=I%20want%20to%20claim%20the%20PM%20Surya%20Ghar%20Subsidy%20before%20the%20deadline" target="_blank" class="pm-banner-btn">Claim ₹78,000 Subsidy Now</a>
      </div>
    `;
    
    // Insert at the very top of the body
    document.body.insertAdjacentHTML('afterbegin', bannerHTML);

    // Countdown Logic
    const countdownDate = new Date("March 31, 2027 23:59:59").getTime();
    const timerDisplay = document.getElementById("pm-timer-display");

    function updateTimer() {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        timerDisplay.innerHTML = "SCHEME CLOSED";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerDisplay.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    // Run immediately, then every second
    updateTimer();
    setInterval(updateTimer, 1000);
  }
});

// =========================================================
// 12. SOLIS CENTRAL CLOUD ANALYTICS TRACKER
// Connects live website actions directly to Firebase Firestore
// =========================================================
(function() {
  const currentPath = window.location.pathname.toLowerCase();
  // Do not track internal admin, login, analytics, or seo dashboard visits
  if (currentPath.includes('/login') || currentPath.includes('/analytics') || currentPath.includes('/seo') || currentPath.includes('/projectcostcalculator')) {
    return;
  }

  // Persistent anonymous visitor ID
  let visitorId = localStorage.getItem('solis_vid');
  if (!visitorId) {
    visitorId = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6);
    localStorage.setItem('solis_vid', visitorId);
  }

  // Fast, privacy-friendly IP Geo lookup (City, Region, Country)
  let visitorGeo = null;
  try {
    const cachedGeo = sessionStorage.getItem('solis_geo');
    if (cachedGeo) visitorGeo = JSON.parse(cachedGeo);
  } catch(e) {}

  if (!visitorGeo) {
    fetch('https://ipwho.is/')
      .then(r => r.json())
      .then(data => {
        if (data && data.success !== false) {
          visitorGeo = {
            city: data.city || '',
            region: data.region || '',
            country: data.country || 'India'
          };
          sessionStorage.setItem('solis_geo', JSON.stringify(visitorGeo));
        }
      })
      .catch(() => {});
  }

  // Google Ads & Campaign ROI Attribution (UTM Parameters & Ad Click IDs)
  let campaignInfo = {
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: '',
    gclid: '',
    fbclid: ''
  };

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    const utmMedium = urlParams.get('utm_medium');
    const utmCampaign = urlParams.get('utm_campaign');
    const utmTerm = urlParams.get('utm_term');
    const utmContent = urlParams.get('utm_content');
    const gclid = urlParams.get('gclid');
    const fbclid = urlParams.get('fbclid');

    if (utmSource || utmCampaign || gclid || fbclid) {
      campaignInfo = {
        source: utmSource || (gclid ? 'google' : (fbclid ? 'facebook' : '')),
        medium: utmMedium || (gclid ? 'cpc' : (fbclid ? 'paid_social' : '')),
        campaign: utmCampaign || (gclid ? 'Google Ads Search' : (fbclid ? 'Meta Ads Campaign' : '')),
        term: utmTerm || '',
        content: utmContent || '',
        gclid: gclid || '',
        fbclid: fbclid || ''
      };
      sessionStorage.setItem('solis_campaign', JSON.stringify(campaignInfo));
    } else {
      const cachedCamp = sessionStorage.getItem('solis_campaign');
      if (cachedCamp) campaignInfo = JSON.parse(cachedCamp);
    }
  } catch(e) {}

  function getDeviceType() {
    const width = window.innerWidth;
    if (width < 768) return 'Mobile';
    if (width < 1024) return 'Tablet';
    return 'Desktop';
  }

  function getTrafficSource() {
    // 1. Google Ads Detection (gclid or utm_source=google & cpc)
    if (campaignInfo.gclid || (campaignInfo.source && campaignInfo.source.toLowerCase() === 'google' && (campaignInfo.medium === 'cpc' || campaignInfo.medium === 'ad'))) {
      return 'Google Ads';
    }
    // 2. Meta Ads Detection (fbclid or facebook/instagram cpc)
    if (campaignInfo.fbclid || ((campaignInfo.source === 'facebook' || campaignInfo.source === 'instagram' || campaignInfo.source === 'meta') && (campaignInfo.medium === 'cpc' || campaignInfo.medium === 'paid_social'))) {
      return 'Meta Ads';
    }
    // 3. Other UTM Source
    if (campaignInfo.source) {
      return campaignInfo.source.charAt(0).toUpperCase() + campaignInfo.source.slice(1);
    }
    // 4. Referrer Detection
    const ref = document.referrer ? document.referrer.toLowerCase() : '';
    if (!ref) return 'Direct / Organic';
    if (ref.includes('google')) return 'Google Search';
    if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'WhatsApp';
    if (ref.includes('facebook') || ref.includes('fb.')) return 'Facebook';
    if (ref.includes('instagram')) return 'Instagram';
    if (ref.includes('youtube')) return 'YouTube';
    try {
      const url = new URL(document.referrer);
      return url.hostname.replace('www.', '');
    } catch(e) {
      return 'Referral';
    }
  }

  function getCampaignName() {
    if (campaignInfo.campaign) return campaignInfo.campaign;
    if (campaignInfo.gclid) return 'Google Ads Campaign';
    if (campaignInfo.fbclid) return 'Meta Ads Campaign';
    return 'Organic / Direct';
  }

  function getLocationString() {
    if (visitorGeo && (visitorGeo.city || visitorGeo.region)) {
      return (visitorGeo.city ? visitorGeo.city + ', ' : '') + (visitorGeo.region || visitorGeo.country || 'India');
    }
    // Fallback: Infer from page location if district specific
    const path = (window.location.pathname || '').toLowerCase();
    if (path.includes('kottayam')) return 'Kottayam, Kerala';
    if (path.includes('thiruvalla') || path.includes('pathanamthitta')) return 'Thiruvalla, Pathanamthitta';
    if (path.includes('kollam')) return 'Kollam, Kerala';
    if (path.includes('alappuzha')) return 'Alappuzha, Kerala';
    if (path.includes('thiruvananthapuram')) return 'Trivandrum, Kerala';
    return 'Kerala, India';
  }

  const FB_FIRESTORE_URL = 'https://firestore.googleapis.com/v1/projects/studio-5037599641-c95bb/databases/(default)/documents/solis/analytics/events?key=AIzaSyB8XGJKxo9jTJDB7UtMpQBuoCT_wqHdEfQ';
  const FB_FORMS_URL = 'https://firestore.googleapis.com/v1/projects/studio-5037599641-c95bb/databases/(default)/documents/solis/forms/submissions?key=AIzaSyB8XGJKxo9jTJDB7UtMpQBuoCT_wqHdEfQ';
  const FB_ALERT_CONFIG_URL = 'https://firestore.googleapis.com/v1/projects/studio-5037599641-c95bb/databases/(default)/documents/solis/alert_config?key=AIzaSyB8XGJKxo9jTJDB7UtMpQBuoCT_wqHdEfQ';

  // Lead Alert Dispatcher: Instant Telegram Bot Alert for Calls, WhatsApp, Forms
  function dispatchLeadTelegramAlert(leadData) {
    try {
      const cachedCfg = localStorage.getItem('solis_alert_config');
      let alertCfg = cachedCfg ? JSON.parse(cachedCfg) : null;

      const sendTelegram = (cfg) => {
        if (!cfg || !cfg.telegramToken || !cfg.telegramChatId || cfg.telegramEnabled === false) return;
        const msgText = 
          `🚨 <b>NEW HOT SOLAR LEAD!</b>\n` +
          `━━━━━━━━━━━━━━━━━━━\n` +
          `🎯 <b>Action:</b> ${leadData.action}\n` +
          `📍 <b>Location:</b> ${leadData.location}\n` +
          `📄 <b>Page:</b> ${leadData.title}\n` +
          `📢 <b>Source:</b> ${leadData.source} ${leadData.campaign && leadData.campaign !== 'Organic / Direct' ? ' (' + leadData.campaign + ')' : ''}\n` +
          (leadData.term ? `🔍 <b>Keyword:</b> ${leadData.term}\n` : '') +
          `ℹ️ <b>Detail:</b> ${leadData.details}\n` +
          `📱 <b>Device:</b> ${leadData.device}\n` +
          `⏰ <b>Time:</b> ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}\n` +
          `🌐 <b>URL:</b> https://www.solisgreenindia.in${leadData.url}`;

        fetch(`https://api.telegram.org/bot${cfg.telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: cfg.telegramChatId,
            text: msgText,
            parse_mode: 'HTML'
          }),
          keepalive: true
        }).catch(() => {});
      };

      if (alertCfg && alertCfg.telegramToken) {
        sendTelegram(alertCfg);
      } else {
        // Query Firestore for configured bot token
        fetch(FB_ALERT_CONFIG_URL)
          .then(r => r.json())
          .then(res => {
            if (res && res.fields) {
              const cfg = {
                telegramToken: res.fields.telegramToken ? res.fields.telegramToken.stringValue : '',
                telegramChatId: res.fields.telegramChatId ? res.fields.telegramChatId.stringValue : '',
                telegramEnabled: res.fields.telegramEnabled ? res.fields.telegramEnabled.booleanValue : true
              };
              localStorage.setItem('solis_alert_config', JSON.stringify(cfg));
              sendTelegram(cfg);
            }
          })
          .catch(() => {});
      }
    } catch(e) {}
  }

  
  // Direct Cloud Backend Lead Collection Handler
  window.saveLeadToFirestore = async function(data) {
    try {
      const timestampIso = new Date().toISOString();
      const doc = {
        fields: {
          name: { stringValue: data.name || 'Website Visitor' },
          phone: { stringValue: data.phone || '' },
          consumerNumber: { stringValue: data.consumerNumber || '' },
          email: { stringValue: data.email || '' },
          service: { stringValue: data.service || 'Solar Installation' },
          location: { stringValue: data.location || detectLocationFromPage() || 'Kerala' },
          message: { stringValue: data.message || '' },
          page: { stringValue: data.page || window.location.pathname },
          device: { stringValue: data.device || (typeof getDeviceType === 'function' ? getDeviceType() : 'Desktop') },
          status: { stringValue: 'New' },
          source: { stringValue: data.source || 'Website Form' },
          createdAt: { stringValue: timestampIso }
        }
      };
      fetch(FB_FORMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
        keepalive: true
      }).then(() => {
        console.log('✅ Lead saved to backend collection: solis/forms/submissions');
      }).catch(err => {
        console.debug('Firestore backend save notice:', err);
      });
    } catch (e) {
      console.warn('Backend save error:', e);
    }
  };

  window.recordSolisEvent = function(type, details) {
    try {
      const cleanTitle = (document.title || 'Solis Solar Kerala').split('|')[0].trim();
      const pageUrl = window.location.pathname || '/';
      const timestampIso = new Date().toISOString();
      const device = getDeviceType();
      const source = getTrafficSource();
      const campaign = getCampaignName();
      const location = getLocationString();
      const city = (visitorGeo && visitorGeo.city) ? visitorGeo.city : '';
      const region = (visitorGeo && visitorGeo.region) ? visitorGeo.region : 'Kerala';
      const country = (visitorGeo && visitorGeo.country) ? visitorGeo.country : 'India';

      const eventPayload = {
        id: 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        vid: visitorId,
        type: type, // 'page_view', 'call_click', 'whatsapp_click', 'form_submit'
        title: cleanTitle,
        url: pageUrl,
        device: device,
        source: source,
        campaign: campaign,
        utm_source: campaignInfo.source || '',
        utm_medium: campaignInfo.medium || '',
        utm_term: campaignInfo.term || '',
        gclid: campaignInfo.gclid || '',
        location: location,
        city: city,
        region: region,
        country: country,
        details: details || '',
        timestamp: timestampIso
      };

      // 1. Update local storage cache
      try {
        const stored = localStorage.getItem('solis_analytics_events');
        let events = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(events)) events = [];
        events.unshift(eventPayload);
        if (events.length > 500) events = events.slice(0, 500);
        localStorage.setItem('solis_analytics_events', JSON.stringify(events));
      } catch(e) {}

      // 2. Stream to Firebase Firestore Cloud Database
      const firestoreDoc = {
        fields: {
          type: { stringValue: type },
          title: { stringValue: cleanTitle },
          url: { stringValue: pageUrl },
          device: { stringValue: device },
          source: { stringValue: source },
          campaign: { stringValue: campaign },
          utm_source: { stringValue: campaignInfo.source || '' },
          utm_medium: { stringValue: campaignInfo.medium || '' },
          utm_term: { stringValue: campaignInfo.term || '' },
          gclid: { stringValue: campaignInfo.gclid || '' },
          location: { stringValue: location },
          city: { stringValue: city },
          region: { stringValue: region },
          country: { stringValue: country },
          details: { stringValue: details || '' },
          vid: { stringValue: visitorId },
          createdAt: { stringValue: timestampIso }
        }
      };

      fetch(FB_FIRESTORE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(firestoreDoc),
        keepalive: true
      }).catch(err => {
        console.debug("Firestore cloud stream notice:", err);
      });

      // 3. Dispatch instant lead alert if this is a high-intent conversion
      if (type === 'call_click' || type === 'whatsapp_click' || type === 'form_submit') {
        let actionLabel = 'Phone Call Clicked';
        if (type === 'whatsapp_click') actionLabel = 'WhatsApp Chat Inquiry';
        if (type === 'form_submit') actionLabel = 'Quote Form Submitted';

        dispatchLeadTelegramAlert({
          action: actionLabel,
          title: cleanTitle,
          url: pageUrl,
          location: location,
          source: source,
          campaign: campaign,
          term: campaignInfo.term,
          device: device,
          details: details || ''
        });
      }

    } catch(err) {
      console.warn("Analytics tracking err:", err);
    }
  };

  // 1. Record Page View on Load (with deduplication for fast reloads)
  const lastViewTime = sessionStorage.getItem('solis_last_view_ts');
  const now = Date.now();
  if (!lastViewTime || (now - parseInt(lastViewTime)) > 2000) {
    sessionStorage.setItem('solis_last_view_ts', now.toString());
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() {
        recordSolisEvent('page_view', 'Page visited');
      });
    } else {
      recordSolisEvent('page_view', 'Page visited');
    }
  }

  // 2. Click Delegation for Calls & WhatsApp
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href') || '';
    if (href.startsWith('tel:')) {
      const phoneNumber = href.replace('tel:', '').trim();
      recordSolisEvent('call_click', 'Phone call clicked: ' + (phoneNumber || '+91 83018 49474'));
    } else if (href.includes('wa.me') || href.includes('whatsapp.com') || link.classList.contains('whatsapp-btn') || link.classList.contains('pm-banner-btn')) {
      recordSolisEvent('whatsapp_click', 'WhatsApp chat inquiry initiated');
    }
  }, true);

  // 3. Form Submit Delegation with Lead Contact Capture & Firestore Persistence
  document.addEventListener('submit', function(e) {
    const form = e.target;
    if (!form || form.id === 'login-form' || form.id === 'central-login-form' || form.id === 'loginForm' || form.id === 'addComponentForm' || form.id === 'manualLeadForm' || form.id === 'sales-form') return;
    if (form.id === 'applicationForm' || form.id === 'jobForm') return; // Handled by Careers HR
    if (form.dataset.managedByScript === "true") return; // Handled directly by initializeForms - prevents duplicate logging
    
    const formName = form.id || form.className || 'Solar Quote Inquiry';
    try {
      const phoneInput = form.querySelector('input[type="tel"], input[name*="phone"], input[placeholder*="Phone"]');
      const nameInput = form.querySelector('input[name*="name"], input[placeholder*="Name"]');
      const consInput = form.querySelector('input[name*="consumer"], input[placeholder*="KSEB"]');
      const emailInput = form.querySelector('input[type="email"], input[name*="email"]');
      const serviceSelect = form.querySelector('select[name*="service"], select');
      const locInput = form.querySelector('input[name*="location"], select[name*="area"], input[placeholder*="Location"]');
      
      const leadSnippet = (nameInput && nameInput.value ? nameInput.value.trim() : '') + 
                          (phoneInput && phoneInput.value ? ' (' + phoneInput.value.trim() + ')' : '') +
                          (consInput && consInput.value ? ' [KSEB #' + consInput.value.trim() + ']' : '');
      const details = leadSnippet ? `Quote Lead: ${leadSnippet} - ${formName}` : `Quote Form Submitted: ${formName}`;
      recordSolisEvent('form_submit', details);
      
      // Auto-capture lead to Firestore collection (solis/forms/submissions) if not already captured
      if (!form.dataset.firestoreCaptured && typeof saveLeadToFirestore === 'function') {
        if (phoneInput && phoneInput.value) {
          form.dataset.firestoreCaptured = "true";
          const data = {
            name: (nameInput && nameInput.value) ? nameInput.value.trim() : 'Website Visitor',
            phone: phoneInput.value.trim(),
            consumerNumber: (consInput && consInput.value) ? consInput.value.trim() : '',
            email: (emailInput && emailInput.value) ? emailInput.value.trim() : '',
            service: (serviceSelect && serviceSelect.value) ? serviceSelect.value.trim() : 'Solar Installation',
            location: (locInput && locInput.value) ? locInput.value.trim() : (typeof detectLocationFromPage === 'function' ? detectLocationFromPage() : 'Kerala'),
            message: form.querySelector('textarea')?.value || '',
            page: window.location.pathname,
            source: 'Website Form (Delegated)'
          };
          saveLeadToFirestore(data);
        }
      }
    } catch (err) {
      recordSolisEvent('form_submit', 'Quote Form Submitted: ' + formName);
    }
  }, true);
})();


