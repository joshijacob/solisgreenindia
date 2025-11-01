// Kollam Specific JavaScript - Dedicated to this location only

document.addEventListener('DOMContentLoaded', function() {
    // Kollam specific area interactions
    function initKollamFeatures() {
        // Initialize cursor trail effect
        initCursorTrail();
        
        // Animate stats counting for Kollam
        animateKollamStats();
        
        // Interactive map for Kollam coverage
        initKollamMap();
        
        // Area selection for Kollam form
        initKollamAreaSelection();
        
        // Kollam specific form handling
        initKollamForm();
        
        // Add Kollam theme
        addKollamTheme();
        
        // Initialize hero animations
        initKollamHero();
        
        // Add interactive effects to buttons
        initInteractiveEffects();
    }

    function initCursorTrail() {
        const cursor = document.querySelector('.cursor-trail');
        let mouseX = 0, mouseY = 0;
        let trailParticles = [];
        
        // Create trail particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.backgroundColor = getRandomColor();
            document.body.appendChild(particle);
            trailParticles.push({
                element: particle,
                x: 0, y: 0,
                life: 0,
                active: false
            });
        }
        
        let particleIndex = 0;
        
        // Mouse move event
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Update cursor position
            if (cursor) {
                cursor.style.left = (mouseX - 10) + 'px';
                cursor.style.top = (mouseY - 10) + 'px';
                cursor.classList.add('active');
            }
            
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
            if (cursor) {
                cursor.classList.remove('active');
            }
        });
        
        // Click effect
        document.addEventListener('click', (e) => {
            createClickEffect(e.clientX, e.clientY);
        });
        
        function getRandomColor() {
            const colors = [
                '#2E7D32', '#1B5E20', '#4CAF50', 
                '#1565C0', '#0D47A1', '#FFC107'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function createClickEffect(x, y) {
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

    function initKollamHero() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Add Kollam specific hero class
            heroSection.classList.add('kollam-theme');
            
            // Add floating animation to hero elements
            const heroElements = heroSection.querySelectorAll('h1, p, .hero-buttons');
            heroElements.forEach((element, index) => {
                element.style.animation = `fadeInUp 1s ease ${index * 0.2}s both`;
            });
            
            // Add port city wave effect to hero background
            createPortCityEffect(heroSection);
        }
    }

    function createPortCityEffect(container) {
        // Add ship-like animations representing port city
        for (let i = 0; i < 4; i++) {
            const ship = document.createElement('div');
            ship.style.cssText = `
                position: absolute;
                width: 40px;
                height: 20px;
                background: rgba(255,255,255,0.3);
                border-radius: 10px 10px 0 0;
                animation: shipMove 15s linear infinite;
                animation-delay: ${i * 4}s;
                pointer-events: none;
                bottom: ${15 + i * 20}%;
                opacity: ${0.2 + i * 0.1};
            `;
            
            // Add ship mast
            const mast = document.createElement('div');
            mast.style.cssText = `
                position: absolute;
                width: 2px;
                height: 15px;
                background: rgba(255,255,255,0.4);
                top: -15px;
                left: 50%;
                transform: translateX(-50%);
            `;
            ship.appendChild(mast);
            
            container.appendChild(ship);
        }
        
        // Add ship animation to styles
        const shipStyle = document.createElement('style');
        shipStyle.textContent = `
            @keyframes shipMove {
                0% {
                    transform: translateX(-100px) rotate(0deg);
                }
                100% {
                    transform: translateX(calc(100vw + 100px)) rotate(0deg);
                }
            }
        `;
        document.head.appendChild(shipStyle);
    }

    function initInteractiveEffects() {
        // Add ripple effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn, .area-item, .legend-item');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
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
                    ripple.remove();
                }, 600);
            });
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

    function animateKollamStats() {
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
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function initKollamMap() {
        const legendItems = document.querySelectorAll('.legend-item');
        const rings = document.querySelectorAll('.ring');
        
        legendItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (rings[index]) {
                    rings[index].style.animationPlayState = 'paused';
                    rings[index].style.borderStyle = 'solid';
                    rings[index].style.borderWidth = '4px';
                    rings[index].style.fontWeight = 'bold';
                    rings[index].style.background = 'rgba(46, 125, 50, 0.1)';
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
                showKollamServiceInfo(serviceType);
            });
        });

        // Add click interaction to central point
        const centralPoint = document.querySelector('.central-point');
        if (centralPoint) {
            centralPoint.addEventListener('click', function() {
                showKollamCoverageInfo();
            });
        }
    }

    function initKollamAreaSelection() {
        const areaItems = document.querySelectorAll('.area-item');
        const areaSelect = document.querySelector('select[placeholder*="Area"]');
        
        areaItems.forEach((item, index) => {
            item.style.cursor = 'pointer';
            item.style.animationDelay = `${index * 0.1}s`;
            
            item.addEventListener('click', function() {
                const areaName = this.querySelector('h4').textContent;
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
                    showAreaSelectionFeedback(areaName);
                }
            });
        });
    }

    function showAreaSelectionFeedback(areaName) {
        // Remove existing feedback if any
        const existingFeedback = document.querySelector('.area-selection-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedback = document.createElement('div');
        feedback.className = 'area-selection-feedback';
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
                    <strong>${areaName}</strong> selected for Kollam quote!
                </div>
            </div>
        `;
        document.body.appendChild(feedback);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    function initKollamForm() {
        const locationForm = document.querySelector('.inquiry-form');
        if (locationForm) {
            locationForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: this.querySelector('input[type="text"]').value,
                    phone: this.querySelector('input[type="tel"]').value,
                    area: this.querySelector('select[placeholder*="Area"]').value,
                    service: this.querySelector('select[placeholder*="Interested"]').value
                };
                
                // Validate form
                if (validateKollamForm(formData)) {
                    // Kollam specific success message
                    showKollamSuccess(formData);
                    
                    // Reset form
                    this.reset();
                }
            });
        }
    }

    function validateKollamForm(formData) {
        if (!formData.name || !formData.phone || !formData.area || !formData.service) {
            showKollamError('Please fill all required fields');
            return false;
        }
        
        if (formData.phone.length < 10) {
            showKollamError('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    function showKollamError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'kollam-error-message';
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

    function showKollamSuccess(formData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'kollam-success-message';
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
                <div style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">⚓⚡</div>
                <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.4rem;">Kollam Quote Request Received!</h3>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    <strong>${formData.name}</strong>, we'll contact you shortly at 
                    <strong>${formData.phone}</strong> for your <strong>${formData.service} Solar</strong> 
                    needs in <strong>${formData.area}</strong>, Kollam.
                </p>
                <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1.5rem;">
                    Our Kollam team will reach out within 30 minutes.
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

    function showKollamCoverageInfo() {
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
                <h4 style="color: var(--primary); margin-bottom: 1rem;">Kollam District Coverage</h4>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    We serve the entire Kollam district including port areas, coastal regions, and major towns with specialized solar solutions.
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

    function showKollamServiceInfo(serviceType) {
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
                    ${getKollamServiceDescription(serviceType)}
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

    function getKollamServiceDescription(serviceType) {
        const descriptions = {
            'City Service (0-10 km)': 'Immediate service within Kollam city and port areas with quick response times.',
            'Coastal Service (10-20 km)': 'Specialized service to coastal regions and beach areas around Kollam.',
            'District Service (20-30 km)': 'Complete coverage across Kollam district including remote coastal towns.'
        };
        return descriptions[serviceType] || 'Professional solar service across Kollam region.';
    }

    function addKollamTheme() {
        // Add Kollam specific theme class to areas
        const areasSection = document.querySelector('.areas-covered');
        if (areasSection) {
            areasSection.classList.add('kollam-theme');
        }
        
        // Add port city-inspired styling to area categories
        const areaCategories = document.querySelectorAll('.area-category');
        areaCategories.forEach(category => {
            category.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%)';
        });
    }

    // Add CSS for Kollam specific animations
    const kollamStyles = document.createElement('style');
    kollamStyles.textContent = `
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
        
        .kollam-error-message {
            animation: slideInDown 0.5s ease;
        }
        
        .kollam-success-message {
            animation: fadeInScale 0.5s ease;
        }
        
        .coverage-info-message, .service-info-message {
            animation: fadeInScale 0.4s ease;
        }
        
        @keyframes fadeInScale {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Kollam specific area animations */
        .kollam-theme .area-item {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(kollamStyles);

    // Initialize Kollam specific features
    initKollamFeatures();
});

// Kollam page load effects
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
    
    // Add Kollam welcome effect
    console.log('⚓ Welcome to Solis Green India - Kollam Solar Solutions ⚡');
    
    // Initialize area items animations
    const areaItems = document.querySelectorAll('.area-item');
    areaItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});
