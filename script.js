// Main JavaScript for Solis Green India Website - Optimized Version

// Configuration Constants
const FORMSUBMIT_URL = 'https://formsubmit.co/ajax/solisgreenindia@gmail.com';
const WHATSAPP_NUMBER = '918301849474';
const SCROLL_THRESHOLD = 300; // Pixels to scroll before BackToTop appears
const SLIDE_INTERVAL_MS = 5000; // Hero slider interval
const NOTIFICATION_DURATION = 5000; // Notification duration in milliseconds
const DEBOUNCE_WAIT = 10; // Debounce wait time for scroll events

// Utility Function: Debounce
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

// Utility Function: Enhanced Tracking
function trackEvent(category, action, label, value = null) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value
        });
    }
    // console.log(`Event Tracked: ${category} - ${action} - ${label}`, value);
}

// ----------------------------------------------------------------------
// 1. MODULE INITIALIZATION (DOM Content Loaded)
// ----------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function() {
    initializeMobileMenu();
    initializeFloatingCTA();
    initializeScrollElements();
    initializeModals();
    initializeFormHandling();
    initializeHeroImages();
    initializeHeroSlider();
    initializeTrackingListeners();

    // Log initialization success
    console.log('Solis Green India website initialized successfully');
});

// ----------------------------------------------------------------------
// 2. MOBILE MENU
// ----------------------------------------------------------------------

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (!mobileMenuBtn || !mainNav) return;

    // Toggle Menu on button click
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const isActive = mainNav.classList.toggle('active');
        this.setAttribute('aria-expanded', isActive);
    });

    // Close menu when clicking on links or outside
    const closeMenu = () => {
        if (mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        }
    };
    
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function(event) {
        if (mainNav.classList.contains('active') && 
            !mainNav.contains(event.target) && 
            !mobileMenuBtn.contains(event.target)) {
            closeMenu();
        }
    });
}

// ----------------------------------------------------------------------
// 3. FLOATING CTA & QUICK QUOTE
// ----------------------------------------------------------------------

function initializeFloatingCTA() {
    const ctaMainBtn = document.getElementById('ctaMainBtn');
    const quickFormBtn = document.getElementById('quickFormBtn');
    const ctaOptions = document.querySelector('.cta-options');
    
    if (!ctaMainBtn || !ctaOptions) return;

    // Toggle CTA Options on button click
    ctaMainBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        ctaOptions.classList.toggle('active');
    });

    // Open Modal from Quick Form Button
    if (quickFormBtn) {
        quickFormBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal('quickQuoteModal');
            ctaOptions.classList.remove('active');
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

// ----------------------------------------------------------------------
// 4. SCROLL ELEMENTS (Back To Top & Scroll Animations)
// ----------------------------------------------------------------------

function initializeScrollElements() {
    const backToTopBtn = document.getElementById('backToTop');
    
    // Smooth scroll to top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Debounced scroll listener for showing/hiding BackToTop button
    window.addEventListener('scroll', debounce(() => {
        if (backToTopBtn) {
            const isVisible = window.pageYOffset > SCROLL_THRESHOLD;
            backToTopBtn.classList.toggle('show', isVisible);
            backToTopBtn.setAttribute('aria-hidden', !isVisible);
        }
    }, DEBOUNCE_WAIT));

    // Scroll Animations (Intersection Observer)
    const animatedElements = document.querySelectorAll('.service-card, .district-card, .feature-item, .testimonial-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Apply a class that triggers the CSS animation
                entry.target.classList.add('animate-visible'); 
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => {
        element.classList.add('animate-hidden'); // Initial state class (requires corresponding CSS)
        observer.observe(element);
    });
}

// ----------------------------------------------------------------------
// 5. MODAL FUNCTIONALITY
// ----------------------------------------------------------------------

function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    
    if (modals.length === 0) return;

    // Delegate close actions
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-modal') || e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = ''; // Reset to default
}

// ----------------------------------------------------------------------
// 6. FORM HANDLING & VALIDATION
// ----------------------------------------------------------------------

function initializeFormHandling() {
    document.querySelectorAll('form.quick-quote-form').forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            if (!validateForm(this)) {
                showNotification('Please fill all required fields correctly.', 'error');
                return;
            }

            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                service: formData.get('service'),
                location: formData.get('location'),
                timestamp: new Date().toLocaleString('en-IN'),
                email: formData.get('email') // Include email if present
            };

            try {
                // Show loading state
                setButtonLoading(submitBtn, true, originalText);

                const formSubmitSuccess = await submitToFormSubmit(data, this);
                
                if (formSubmitSuccess) {
                    handleFormSuccess(submitBtn, originalText, this);
                } else {
                    // Fallback to WhatsApp only if FormSubmit fails
                    fallbackToWhatsApp(data);
                    setButtonLoading(submitBtn, false, originalText);
                }

            } catch (error) {
                console.error('Form submission failed:', error);
                fallbackToWhatsApp(data);
                setButtonLoading(submitBtn, false, originalText);
            }
        });

        // Real-time validation listeners
        form.querySelectorAll('input, select').forEach(input => {
            input.addEventListener('blur', function() { validateField(this); });
            input.addEventListener('input', function() { clearFieldError(this); });
        });
    });
}

// Helper: Set Button Loading State
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

// Helper: Handle Form Success
function handleFormSuccess(submitBtn, originalText, form) {
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
    showNotification('Thank you! We will call you within 30 minutes.', 'success');
    
    trackEvent('Conversion', 'form_success', 'Quote Request', 1.0); // Unified tracking
    
    // Reset form after delay
    setTimeout(() => {
        form.reset();
        setButtonLoading(submitBtn, false, originalText);
        closeAllModals();
    }, 3000);
}


// FormSubmit Integration
async function submitToFormSubmit(data, form) {
    try {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('phone', data.phone);
        formData.append('service', data.service);
        formData.append('location', data.location || 'Not specified');
        formData.append('timestamp', data.timestamp);
        formData.append('_subject', `🔆 New Solar Quote - ${data.name}`);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('_replyto', data.email || '');
        
        // Use the actual form action if present, otherwise use constant
        const actionUrl = form.action || FORMSUBMIT_URL; 

        const response = await fetch(actionUrl, {
            method: 'POST',
            body: formData
        });

        return response.ok;
    } catch (error) {
        // console.warn('FormSubmit error, falling back to WhatsApp:', error);
        return false;
    }
}

// WhatsApp Fallback
function fallbackToWhatsApp(data) {
    const message = `🔆 SOLIS GREEN INDIA - Quote Request 🔆

Name: ${data.name}
Phone: ${data.phone}
Service Needed: ${data.service}
Location: ${data.location || 'Not specified'}
Timestamp: ${data.timestamp}

URGENT: Please contact for solar installation quote.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    showNotification('Form submission failed! Opening WhatsApp to send your details.', 'warning');
    
    trackEvent('Form', 'whatsapp_fallback', 'FormSubmit Fail');
}

// Validation Functions (Kept largely the same for logic preservation)
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
    } else if (value) { // Only mark success if there is a value
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
    // Note: The styles for this should ideally be in a CSS file.
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


// ----------------------------------------------------------------------
// 7. NOTIFICATION SYSTEM (Simplified CSS integration)
// ----------------------------------------------------------------------

function showNotification(message, type = 'info') {
    // Standard function logic retained, but styling should use classes for cleaner code
    // For brevity, the original inline style creation is kept, but it's not best practice.

    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    // ... (rest of notification creation and styling logic remains the same)
    
    // START: Notification Styling Logic
    const getNotificationIcon = (type) => {
        const icons = { success: 'check-circle', error: 'exclamation-triangle', info: 'info-circle', warning: 'exclamation-circle' };
        return icons[type] || 'info-circle';
    };
    const getNotificationColor = (type) => {
        const colors = { success: '#28a745', error: '#dc3545', info: '#17a2b8', warning: '#ffc107' };
        return colors[type] || '#17a2b8';
    };

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;

    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: ${getNotificationColor(type)};
        color: white; padding: 15px 20px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000; max-width: 400px; animation: slideInRight 0.3s ease;
    `;
    notification.querySelector('.notification-content').style.cssText = `
        display: flex; align-items: center; gap: 10px;
    `;
    notification.querySelector('.notification-close').style.cssText = `
        background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;
        margin-left: auto; padding: 0; width: 20px; height: 20px; display: flex;
        align-items: center; justify-content: center;
    `;
    // END: Notification Styling Logic

    document.body.appendChild(notification);

    const autoRemove = setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, NOTIFICATION_DURATION);

    notification.querySelector('.notification-close').addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}


// ----------------------------------------------------------------------
// 8. HERO IMAGES & SLIDER
// ----------------------------------------------------------------------

function initializeHeroImages() {
    document.querySelectorAll('.hero-bg-image').forEach((img, index) => {
        img.addEventListener('error', function() {
            // console.warn(`Hero image ${index + 1} failed to load, using fallback`);
            this.style.display = 'none';
            const slide = this.closest('.hero-slide');
            if (slide) {
                // Simplified fallback colors
                const fallbackColors = ['#1a5276', '#27ae60', '#8e44ad'];
                slide.style.background = fallbackColors[index % fallbackColors.length];
            }
        });
    });
}

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
        currentSlide = (index + slides.length) % slides.length; // Ensures index is always valid
        slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    const startAutoSlide = () => {
        stopAutoSlide(); // Clear existing interval before starting a new one
        slideInterval = setInterval(nextSlide, SLIDE_INTERVAL_MS);
    };

    const stopAutoSlide = () => clearInterval(slideInterval);

    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAutoSlide(); startAutoSlide(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAutoSlide(); startAutoSlide(); });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => { showSlide(index); stopAutoSlide(); startAutoSlide(); });
    });

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    // Initialize first slide and start auto slide
    showSlide(0);
    startAutoSlide();
}

// ----------------------------------------------------------------------
// 9. TRACKING LISTENERS
// ----------------------------------------------------------------------

function initializeTrackingListeners() {
    // Track form submissions (FormSubmit success is tracked internally)
    document.querySelectorAll('form').forEach(form => {
        // Event listeners are already handled in initializeFormHandling,
        // but we add a general submit tracker here just in case.
        form.addEventListener('submit', () => {
            trackEvent('Form', 'submit_attempt', form.id || 'unknown-form');
        }, { once: true }); // Track only the first attempt unless form resets
    });
    
    // Track phone clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'phone_click', link.textContent.trim());
        });
    });
    
    // Track WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Contact', 'whatsapp_click', link.textContent.trim());
        });
    });
    
    // Track CTA clicks
    document.querySelectorAll('#quickFormBtn, .cta-button').forEach(button => {
        button.addEventListener('click', () => {
            trackEvent('CTA', 'button_click', button.textContent.trim());
        });
    });
}

// ----------------------------------------------------------------------
// 10. OPTIONAL SERVICE WORKER (PWA)
// ----------------------------------------------------------------------

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                // console.log('ServiceWorker registration successful');
            })
            .catch(function(error) {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}
/* =========================================================
   THIRUVALLA PAGE – CONVERSION ADDITIONS (APPEND ONLY)
   ========================================================= */

/* ---------- EMI CALCULATOR LOGIC ---------- */
function calculateEMI() {
    const loanAmountEl = document.getElementById('loanAmount');
    const loanPeriodEl = document.getElementById('loanPeriod');
    const interestRateEl = document.getElementById('interestRate');
    const resultBox = document.getElementById('emiResult');

    if (!loanAmountEl || !loanPeriodEl || !interestRateEl || !resultBox) return;

    const loanAmount = parseFloat(loanAmountEl.value);
    const years = parseInt(loanPeriodEl.value);
    const annualRate = parseFloat(interestRateEl.value);

    if (!loanAmount || !years || !annualRate) {
        resultBox.innerHTML = '<p style="color:red;">Please fill all fields correctly.</p>';
        return;
    }

    const monthlyRate = annualRate / 12 / 100;
    const months = years * 12;

    const emi =
        (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

    const totalPayable = emi * months;
    const totalInterest = totalPayable - loanAmount;

    resultBox.innerHTML = `
        <p><strong>Monthly EMI:</strong> ₹${emi.toFixed(0)}</p>
        <p><strong>Total Interest:</strong> ₹${totalInterest.toFixed(0)}</p>
        <p><strong>Total Amount Payable:</strong> ₹${totalPayable.toFixed(0)}</p>
    `;

    if (typeof trackEvent === 'function') {
        trackEvent('EMI', 'calculate', 'Thiruvalla Page', emi.toFixed(0));
    }
}

/* ---------- STICKY CONTACT BAR CLICK TRACKING ---------- */
document.addEventListener('DOMContentLoaded', function () {
    const stickyLinks = document.querySelectorAll('.sticky-contact-bar a');

    stickyLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (typeof trackEvent === 'function') {
                trackEvent(
                    'Contact',
                    'sticky_bar_click',
                    this.className || 'sticky-action'
                );
            }
        });
    });
});

/* ---------- BRAND SAFETY (NON-INTRUSIVE CHECK) ---------- */
/* Ensures no accidental old brand references are used dynamically */
(function brandSafetyCheck() {
    const brandName = 'Solis Green Energy Solutions';
    document.querySelectorAll('[data-brand]').forEach(el => {
        el.textContent = brandName;
    });
})();
/* ---------- EMI BUTTON EVENT BIND ---------- */
document.addEventListener('DOMContentLoaded', function () {
    const emiBtn = document.getElementById('emiCalcBtn');
    if (emiBtn) {
        emiBtn.addEventListener('click', calculateEMI);
    }
});
/* =========================================================
   FINAL MOBILE HAMBURGER MENU JS FIX (APPEND ONLY)
   ========================================================= */

document.addEventListener('click', function (e) {
    const menuBtn = e.target.closest('#mobileMenuBtn');
    if (!menuBtn) return;

    const nav = document.getElementById('mainNav');
    if (!nav) return;

    nav.classList.toggle('active');
});
