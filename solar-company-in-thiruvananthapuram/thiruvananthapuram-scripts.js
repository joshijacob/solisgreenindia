// Thiruvananthapuram Specific JavaScript with Enhanced Effects

document.addEventListener('DOMContentLoaded', function() {
    // Enhanced Cursor Trail Effect
    const cursorTrail = document.querySelector('.cursor-trail');
    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorTrail.style.opacity = '1';
    });
    
    function animateCursor() {
        trailX += (mouseX - trailX) * 0.1;
        trailY += (mouseY - trailY) * 0.1;
        
        cursorTrail.style.left = trailX + 'px';
        cursorTrail.style.top = trailY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Enhanced Floating CTA
    const ctaMainBtn = document.getElementById('ctaMainBtn');
    const floatingCta = document.querySelector('.floating-cta');
    
    ctaMainBtn.addEventListener('click', function() {
        floatingCta.classList.toggle('active');
    });
    
    // Quick Quote Modal
    const quickFormBtn = document.getElementById('quickFormBtn');
    const quickQuoteModal = document.getElementById('quickQuoteModal');
    const closeModal = document.querySelector('.close-modal');
    
    quickFormBtn.addEventListener('click', function(e) {
        e.preventDefault();
        quickQuoteModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });
    
    closeModal.addEventListener('click', function() {
        quickQuoteModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === quickQuoteModal) {
            quickQuoteModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Enhanced Mobile Menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    mobileMenuBtn.addEventListener('click', function() {
        mainNav.classList.toggle('active');
        this.classList.toggle('active');
    });
    
    // Enhanced Scroll Effects
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
        
        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        hero.style.transform = `translateY(${scrollY * 0.5}px)`;
        
        // Animate elements on scroll
        animateOnScroll();
    });
    
    // Enhanced Form Handling
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
                submitBtn.style.background = 'var(--secondary)';
                
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    submitBtn.style.background = '';
                }, 3000);
            }, 2000);
        });
    });
    
    // Enhanced Area Item Interactions
    const areaItems = document.querySelectorAll('.area-item');
    areaItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });
    
    // Enhanced Service Card Animations
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Enhanced Project Card Interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const placeholder = this.querySelector('.project-placeholder');
            placeholder.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            const placeholder = this.querySelector('.project-placeholder');
            placeholder.style.transform = 'scale(1) rotate(0)';
        });
    });
    
    // Enhanced Contact Method Interactions
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.3)';
        });
        
        method.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1)';
        });
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Enhanced Loading Animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Add confetti effect on load
        createConfetti();
    });
    
    // Confetti Effect Function
    function createConfetti() {
        const colors = ['#1a5276', '#27ae60', '#f39c12', '#d4af37'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}vw;
                opacity: ${Math.random() + 0.5};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: fall ${Math.random() * 3 + 2}s linear forwards;
                z-index: 9999;
            `;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // Add confetti animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
            }
        }
        
        .confetti {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
    
    // Animate on scroll function
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .feature-item, .project-card, .area-category');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialize animations
    animateOnScroll();
    
    // Enhanced Typing Effect for Hero Text
    const heroTitle = document.querySelector('.hero h1');
    const originalText = heroTitle.textContent;
    heroTitle.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < originalText.length) {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 1000);
});
