// Thiruvananthapuram Specific JavaScript - Capital City Theme

document.addEventListener('DOMContentLoaded', function() {
    // Capital city specific features
    function initThiruvananthapuramFeatures() {
        // Initialize cursor trail effect
        initCursorTrail();
        
        // Animate stats counting for capital city
        animateCapitalStats();
        
        // Interactive map for capital city coverage
        initCapitalMap();
        
        // Area selection for capital city form
        initCapitalAreaSelection();
        
        // Capital city specific form handling
        initCapitalForm();
        
        // Add capital city theme
        addCapitalTheme();
        
        // Initialize hero animations
        initCapitalHero();
        
        // Add interactive effects to buttons
        initInteractiveEffects();
    }

    function initCursorTrail() {
        const cursor = document.querySelector('.cursor-trail');
        if (!cursor) return;
        
        let mouseX = 0, mouseY = 0;
        let trailParticles = [];
        
        // Create trail particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.backgroundColor = getRandomCapitalColor();
            document.body.appendChild(particle);
            trailParticles.push({
                element: particle,
                x: 0, y: 0,
                life: 0,
                active: false
            });
        }
        
        let particleIndex = 0;
        let lastTime = 0;
        const throttleDelay = 16; // ~60fps
        
        // Mouse move event with throttling
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastTime < throttleDelay) return;
            lastTime = now;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update cursor position
            cursor.style.left = (mouseX - 10) + 'px';
            cursor.style.top = (mouseY - 10) + 'px';
            cursor.classList.add('active');
            
            // Create trail particle
            if (trailParticles.length > 0) {
                const particle = trailParticles[particleIndex];
                particle.element.style.left = (mouseX - 3) + 'px';
                particle.element.style.top = (mouseY - 3) + 'px';
                particle.element.style.animation = 'none';
                particle.element.offsetHeight; // Trigger reflow
                particle.element.style.animation = 'trailFade 0.6s ease-out forwards';
                
                particleIndex = (particleIndex + 1) % trailParticles.length;
            }
        });
        
        // Mouse leave event
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
        
        // Click effect
        document.addEventListener('click', (e) => {
            createCapitalClickEffect(e.clientX, e.clientY);
        });
        
        function getRandomCapitalColor() {
            const colors = [
                '#0D47A1', '#1565C0', '#1976D2', 
                '#2196F3', '#42A5F5', '#FFC107'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function createCapitalClickEffect(x, y) {
            const effect = document.createElement('div');
            effect.style.cssText = `
                position: fixed;
                width: 40px;
                height: 40px;
                border: 2px solid var(--primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x - 20}px;
                top: ${y - 20}px;
                animation: clickEffect 0.6s ease-out forwards;
            `;
            
            document.body.appendChild(effect);
            
            setTimeout(() => {
                effect.remove();
            }, 600);
        }
        
        // Add click effect animation
        const clickStyle = document.createElement('style');
        clickStyle.textContent = `
            @keyframes clickEffect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(clickStyle);
    }

    function initCapitalHero() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Add capital city specific hero class
            heroSection.classList.add('capital-theme');
            
            // Add floating animation to hero elements
            const heroElements = heroSection.querySelectorAll('h1, p, .hero-buttons');
            heroElements.forEach((element, index) => {
                element.style.animation = `fadeInUp 1s ease ${index * 0.2}s both`;
            });
            
            // Add capital city building effect to hero background
            createCapitalCityEffect(heroSection);
        }
    }

    function createCapitalCityEffect(container) {
        // Add building-like animations representing capital city
        for (let i = 0; i < 5; i++) {
            const building = document.createElement('div');
            building.style.cssText = `
                position: absolute;
                width: ${20 + i * 8}px;
                height: ${40 + i * 15}px;
                background: rgba(255,255,255,0.2);
                bottom: 0;
                left: ${20 + i * 18}%;
                border-radius: 5px 5px 0 0;
                animation: buildingGlow 4s ease-in-out infinite;
                animation-delay: ${i * 0.8}s;
                pointer-events: none;
            `;
            
            // Add building windows
            for (let j = 0; j < 3; j++) {
                const window = document.createElement('div');
                window.style.cssText = `
                    position: absolute;
                    width: 4px;
                    height: 6px;
                    background: rgba(255,255,255,0.4);
                    top: ${10 + j * 12}px;
                    left: 50%;
                    transform: translateX(-50%);
                    border-radius: 1px;
                `;
                building.appendChild(window);
            }
            
            container.appendChild(building);
        }
        
        // Add building animation to styles
        const buildingStyle = document.createElement('style');
        buildingStyle.textContent = `
            @keyframes buildingGlow {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.6; }
            }
        `;
        document.head.appendChild(buildingStyle);
    }

    function initInteractiveEffects() {
        // Add ripple effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .area-item, .legend-item');
        
        interactiveElements.forEach(element => {
            const rippleHandler = function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 0;
                    height: 0;
                    background: rgba(255,255,255,0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: rippleEffect 0.6s ease-out;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 600);
            };
            
            element.addEventListener('mouseenter', rippleHandler);
            element._rippleHandler = rippleHandler;
        });
        
        // Add ripple animation
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes rippleEffect {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 0.5;
                }
                100% {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }

    function animateCapitalStats() {
        const statItems = document.querySelectorAll('.stat-item');
        
        statItems.forEach(stat => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statNumber = stat.querySelector('.stat-number');
                        const targetText = statNumber.textContent;
                        
                        if (targetText.includes('km')) {
                            // For distance stats
                            const targetNumber = parseInt(targetText);
                            animateNumber(statNumber, 0, targetNumber, 1500, 'km');
                        } else if (targetText.includes('/')) {
                            // For 24/7 type stats
                            statNumber.textContent = '24/7';
                        } else {
                            // For count stats
                            const targetNumber = parseInt(targetText);
                            animateNumber(statNumber, 0, targetNumber, 2000, '+');
                        }
                        
                        observer.unobserve(stat);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(stat);
        });
    }

    function animateNumber(element, start, end, duration, suffix = '') {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smoother animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(easeOutQuart * (end - start) + start);
            
            element.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function initCapitalMap() {
        const legendItems = document.querySelectorAll('.legend-item');
        const rings = document.querySelectorAll('.ring');
        
        legendItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (rings[index]) {
                    rings[index].style.animationPlayState = 'paused';
                    rings[index].style.borderStyle = 'solid';
                    rings[index].style.borderWidth = '4px';
                    rings[index].style.fontWeight = 'bold';
                    rings[index].style.background = 'rgba(13, 71, 161, 0.1)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (rings[index]) {
                    rings[index].style.animationPlayState = 'running';
                    rings[index].style.borderStyle = 'dashed';
                    rings[index].style.borderWidth = '3px';
                    rings[index].style.fontWeight = '600';
                    rings[index].style.background = 'rgba(255, 255, 255, 0.8)';
                }
            });
            
            // Add click to legend items
            item.addEventListener('click', function() {
                const serviceType = this.querySelector('span:last-child').textContent;
                showCapitalServiceInfo(serviceType);
            });
        });

        // Add click interaction to central point
        const centralPoint = document.querySelector('.central-point');
        if (centralPoint) {
            centralPoint.addEventListener('click', function() {
                showCapitalCoverageInfo();
            });
        }
    }

    function initCapitalAreaSelection() {
        const areaItems = document.querySelectorAll('.area-item');
        const areaSelect = document.querySelector('select[placeholder*="Area"]');
        
        areaItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.style.animationDelay = `${index * 0.1}s`;
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Select ${item.querySelector('h4').textContent} for solar quote`);
            
            // Keyboard support
            item.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleAreaSelection(item, areaSelect);
                }
            });
            
            // Click support
            item.addEventListener('click', () => {
                handleAreaSelection(item, areaSelect);
            });
        });
        
        function handleAreaSelection(item, areaSelect) {
            const areaName = item.querySelector('h4').textContent;
            if (areaSelect) {
                // Find matching option
                const options = areaSelect.options;
                for (let i = 0; i < options.length; i++) {
                    if (options[i].text.toLowerCase().includes(areaName.toLowerCase())) {
                        areaSelect.selectedIndex = i;
                        break;
                    }
                }
                
                // Smooth scroll to contact form
                const contactForm = document.querySelector('.contact-form');
                if (contactForm) {
                    contactForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Highlight the form
                    contactForm.style.transform = 'scale(1.02)';
                    contactForm.style.transition = 'transform 0.3s ease';
                    setTimeout(() => {
                        contactForm.style.transform = 'scale(1)';
                    }, 500);
                }
                
                // Show selection feedback
                showCapitalSelectionFeedback(areaName);
            }
        }
    }

    function showCapitalSelectionFeedback(areaName) {
        // Remove existing feedback if any
        const existingFeedback = document.querySelector('.area-selection-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = 'area-selection-feedback';
        feedback.setAttribute('aria-live', 'polite');
        feedback.setAttribute('aria-atomic', 'true');
        feedback.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--primary);
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInRight 0.5s ease;
                border-left: 4px solid var(--secondary);
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>${areaName}</strong> selected for capital city quote!
                </div>
            </div>
        `;
        document.body.appendChild(feedback);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    function initCapitalForm() {
        const locationForm = document.querySelector('.inquiry-form');
        if (!locationForm) return;
        
        let isSubmitting = false;
        
        locationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (isSubmitting) return;
            isSubmitting = true;
            
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            try {
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitButton.disabled = true;
                
                const formData = {
                    name: this.querySelector('input[type="text"]').value.trim(),
                    phone: this.querySelector('input[type="tel"]').value.trim(),
                    area: this.querySelector('select[placeholder*="Area"]').value,
                    service: this.querySelector('select[placeholder*="Interested"]').value
                };
                
                if (validateCapitalForm(formData)) {
                    // Simulate API call
                    await submitCapitalForm(formData);
                    showCapitalSuccess(formData);
                    this.reset();
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showCapitalError('Failed to submit form. Please try again.');
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                isSubmitting = false;
            }
        });
    }

    function validateCapitalForm(formData) {
        if (!formData.name || !formData.phone || !formData.area || !formData.service) {
            showCapitalError('Please fill all required fields');
            return false;
        }
        
        if (formData.phone.length < 10) {
            showCapitalError('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    function submitCapitalForm(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // In real implementation, this would be an API call
                console.log('Capital city form submitted:', formData);
                resolve();
            }, 1000);
        });
    }

    function showCapitalError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'capital-error-message';
        errorMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: #f44336;
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideInDown 0.5s ease;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <i class="fas fa-exclamation-triangle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(errorMessage);
        
        setTimeout(() => {
            errorMessage.remove();
        }, 3000);
    }

    function showCapitalSuccess(formData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'capital-success-message';
        successMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2.5rem;
                border-radius: 15px;
                box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                border-left: 5px solid var(--primary);
                max-width: 400px;
                width: 90%;
            ">
                <div style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">🏛️⚡</div>
                <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.4rem;">Capital City Quote Received!</h3>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    <strong>${formData.name}</strong>, we'll contact you shortly at 
                    <strong>${formData.phone}</strong> for your <strong>${formData.service} Solar</strong> 
                    needs in <strong>${formData.area}</strong>, Thiruvananthapuram.
                </p>
                <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1.5rem;">
                    Our capital city team will reach out within 30 minutes.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                    transition: background 0.3s ease;
                " onmouseover="this.style.background='var(--primary-dark)'" 
                   onmouseout="this.style.background='var(--primary)'">
                    Close
                </button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(successMessage);
    }

    function showCapitalCoverageInfo() {
        const infoMessage = document.createElement('div');
        infoMessage.className = 'coverage-info-message';
        infoMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                max-width: 350px;
                width: 90%;
            ">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">Capital City Coverage</h4>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    We serve the entire Thiruvananthapuram district including government areas, IT corridor, coastal regions, and suburban towns with specialized solar solutions.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Got it</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(infoMessage);
    }

    function showCapitalServiceInfo(serviceType) {
        const infoMessage = document.createElement('div');
        infoMessage.className = 'service-info-message';
        infoMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                text-align: center;
                max-width: 350px;
                width: 90%;
            ">
                <h4 style="color: var(--primary); margin-bottom: 1rem;">${serviceType}</h4>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    ${getCapitalServiceDescription(serviceType)}
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--primary);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                ">Understand</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                z-index: 9999;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(infoMessage);
    }

    function getCapitalServiceDescription(serviceType) {
        const descriptions = {
            'City Center (0-10 km)': 'Immediate service within capital city center and government areas with quick response times.',
            'IT Corridor (10-20 km)': 'Specialized service to Technopark, IT companies, and educational institutions.',
            'Suburban Areas (20-30 km)': 'Complete coverage across suburban regions and outskirts of Thiruvananthapuram.'
        };
        return descriptions[serviceType] || 'Professional solar service across capital city region.';
    }

    function addCapitalTheme() {
        // Add capital city specific theme class to areas
        const areasSection = document.querySelector('.areas-covered');
        if (areasSection) {
            areasSection.classList.add('capital-theme');
        }
        
        // Add capital city-inspired styling to area categories
        const areaCategories = document.querySelectorAll('.area-category');
        areaCategories.forEach(category => {
            category.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)';
        });
    }

    // Add CSS for capital city specific animations
    const capitalStyles = document.createElement('style');
    capitalStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideInDown {
            from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        .area-selection-feedback {
            animation: slideInRight 0.5s ease;
        }
        
        .capital-error-message {
            animation: slideInDown 0.5s ease;
        }
        
        .capital-success-message {
            animation: fadeInScale 0.5s ease;
        }
        
        .coverage-info-message, .service-info-message {
            animation: fadeInScale 0.4s ease;
        }
        
        @keyframes fadeInScale {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Capital city specific area animations */
        .capital-theme .area-item {
            animation: fadeInUp 0.6s ease forwards;
        }
        
        /* Disable cursor trail on mobile and for reduced motion */
        @media (max-width: 768px) {
            .cursor-trail {
                display: none !important;
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .cursor-trail, .trail-particle {
                display: none !important;
            }
            
            * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(capitalStyles);

    // Initialize capital city specific features
    initThiruvananthapuramFeatures();
});

// Capital city page load effects
window.addEventListener('load', function() {
    // Add loading animation for areas section
    const areasSection = document.querySelector('.areas-covered');
    if (areasSection) {
        areasSection.style.opacity = '0';
        areasSection.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            areasSection.style.transition = 'all 0.8s ease';
            areasSection.style.opacity = '1';
            areasSection.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Add capital city welcome effect
    console.log('🏛️ Welcome to Solis Green India - Thiruvananthapuram Solar Solutions ⚡');
    
    // Initialize area items animations
    const areaItems = document.querySelectorAll('.area-item');
    areaItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Cleanup function to prevent memory leaks
function cleanupCapitalFeatures() {
    const interactiveElements = document.querySelectorAll('.btn, .area-item, .legend-item');
    interactiveElements.forEach(element => {
        if (element._rippleHandler) {
            element.removeEventListener('mouseenter', element._rippleHandler);
        }
    });
    
    // Remove dynamically added styles
    const dynamicStyles = document.querySelectorAll('style[data-capital-dynamic]');
    dynamicStyles.forEach(style => style.remove());
}

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanupCapitalFeatures);
