// Mobile Menu Toggle
document.getElementById('mobileMenuBtn').addEventListener('click', function() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('active');
});

// Mobile Dropdown Toggle
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('active');
        }
    });
});

// Smooth Scrolling for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            document.getElementById('mainNav').classList.remove('active');
            
            // Close mobile dropdowns
            document.querySelectorAll('.dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
});

// Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            
            if (!name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Simulate form submission
            alert('Thank you for your message, ' + name + '! We will get back to you within 24 hours.');
            this.reset();
        });
    }
});

// View All Cities Toggle
function initCitiesToggle() {
    const viewAllBtn = document.getElementById('viewAllCitiesBtn');
    const allCitiesGrid = document.getElementById('allCitiesGrid');
    
    if (viewAllBtn && allCitiesGrid) {
        viewAllBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (allCitiesGrid.style.display === 'none' || allCitiesGrid.style.display === '') {
                allCitiesGrid.style.display = 'grid';
                viewAllBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less Cities';
            } else {
                allCitiesGrid.style.display = 'none';
                viewAllBtn.innerHTML = '<i class="fas fa-map"></i> View All 17 Service Locations';
            }
            
            // Smooth scroll to cities section
            document.getElementById('cities').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Phone number formatting and tracking
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Phone call tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'Contact',
                    'event_label': 'Phone Call Initiated'
                });
            }
            console.log('Phone call initiated to: ' + this.href);
        });
    });
}

// WhatsApp tracking
function initWhatsAppTracking() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // WhatsApp click tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'whatsapp_click', {
                    'event_category': 'Contact',
                    'event_label': 'WhatsApp Chat Initiated'
                });
            }
            console.log('WhatsApp chat initiated');
        });
    });
}

// Form submission tracking
function initFormTracking() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Submitted'
                });
            }
        });
    });
}

// Direction click tracking
function initDirectionTracking() {
    const directionLinks = document.querySelectorAll('a[href*="maps.app.goo.gl"]');
    directionLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'get_directions', {
                    'event_category': 'Contact',
                    'event_label': 'Get Directions Clicked'
                });
            }
        });
    });
}

// Fade in animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.service-card, .product-card, .project-card, .resource-card, .city-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCitiesToggle();
    initPhoneTracking();
    initWhatsAppTracking();
    initFormTracking();
    initDirectionTracking();
    initAnimations();
});

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.matches('.dropdown-toggle')) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            if (window.innerWidth > 768) {
                dropdown.style.opacity = '0';
                dropdown.style.visibility = 'hidden';
                dropdown.style.transform = 'translateY(10px)';
            } else {
                dropdown.classList.remove('active');
            }
        });
    }
});

// Google Maps Integration
function initGoogleMaps() {
    const mapLinks = document.querySelectorAll('a[href*="maps.app.goo.gl"]');
    mapLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
    });
}

// Initialize Google Maps integration
document.addEventListener('DOMContentLoaded', function() {
    initGoogleMaps();
});
