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

// Simple Solar Calculator (placeholder functionality)
function initSolarCalculator() {
    const calculatorBtn = document.querySelector('a[href="#solar-calculator"]');
    if (calculatorBtn) {
        calculatorBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Solar Calculator coming soon! This feature will help you estimate your potential savings and system requirements.');
        });
    }
}

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
                viewAllBtn.innerHTML = '<i class="fas fa-map"></i> View All 14 Service Locations';
            }
            
            // Smooth scroll to cities section
            document.getElementById('cities').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initSolarCalculator();
    initCitiesToggle();
    
    // Add loading animation for cards
    const cards = document.querySelectorAll('.service-card, .product-card, .project-card, .resource-card, .city-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
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
    // This would be replaced with actual Google Maps API integration
    const mapLinks = document.querySelectorAll('a[href*="maps.app.goo.gl"]');
    mapLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener');
    });
}

// Phone number formatting and tracking
function initPhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Here you can add phone call tracking
            console.log('Phone call initiated to: ' + this.href);
        });
    });
}

// WhatsApp tracking
function initWhatsAppTracking() {
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Here you can add WhatsApp click tracking
            console.log('WhatsApp chat initiated');
        });
    });
}

// Initialize tracking functions
document.addEventListener('DOMContentLoaded', function() {
    initGoogleMaps();
    initPhoneTracking();
    initWhatsAppTracking();
});
