// Pathanamthitta Specific JavaScript - Dedicated to this location only

document.addEventListener('DOMContentLoaded', function() {
    // Pathanamthitta specific area interactions
    function initPathanamthittaFeatures() {
        // Animate stats counting for Pathanamthitta
        animatePathanamthittaStats();
        
        // Interactive map for Pathanamthitta coverage
        initPathanamthittaMap();
        
        // Area selection for Pathanamthitta form
        initPathanamthittaAreaSelection();
        
        // Pathanamthitta specific form handling
        initPathanamthittaForm();
        
        // Add Pathanamthitta theme
        addPathanamthittaTheme();
        
        // Initialize hero animations
        initPathanamthittaHero();
    }

    function initPathanamthittaHero() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Add Pathanamthitta specific hero class
            heroSection.classList.add('pathanamthitta-theme');
            
            // Add floating animation to hero elements
            const heroElements = heroSection.querySelectorAll('h1, p, .hero-buttons');
            heroElements.forEach((element, index) => {
                element.style.animation = `fadeInUp 1s ease ${index * 0.2}s both`;
            });
            
            // Add pilgrimage-inspired effect to hero background
            createPilgrimageEffect(heroSection);
        }
    }

    function createPilgrimageEffect(container) {
        // Add floating particles representing pilgrimage
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 6px;
                height: 6px;
                background: rgba(255,255,255,0.6);
                border-radius: 50%;
                animation: floatParticle 8s linear infinite;
                animation-delay: ${i * 1}s;
                pointer-events: none;
            `;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            container.appendChild(particle);
        }
        
        // Add particle animation to styles
        const particleStyle = document.createElement('style');
        particleStyle.textContent = `
            @keyframes floatParticle {
                0% {
                    transform: translateY(0) translateX(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) translateX(${Math.random() > 0.5 ? 50 : -50}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyle);
    }

    function animatePathanamthittaStats() {
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

    function initPathanamthittaMap() {
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
                showPathanamthittaServiceInfo(serviceType);
            });
        });

        // Add click interaction to central point
        const centralPoint = document.querySelector('.central-point');
        if (centralPoint) {
            centralPoint.addEventListener('click', function() {
                showPathanamthittaCoverageInfo();
            });
        }
    }

    function initPathanamthittaAreaSelection() {
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
                    <strong>${areaName}</strong> selected for Pathanamthitta quote!
                </div>
            </div>
        `;
        document.body.appendChild(feedback);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    function initPathanamthittaForm() {
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
                if (validatePathanamthittaForm(formData)) {
                    // Pathanamthitta specific success message
                    showPathanamthittaSuccess(formData);
                    
                    // Reset form
                    this.reset();
                }
            });
        }
    }

    function validatePathanamthittaForm(formData) {
        if (!formData.name || !formData.phone || !formData.area || !formData.service) {
            showPathanamthittaError('Please fill all required fields');
            return false;
        }
        
        if (formData.phone.length < 10) {
            showPathanamthittaError('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    function showPathanamthittaError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'pathanamthitta-error-message';
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

    function showPathanamthittaSuccess(formData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'pathanamthitta-success-message';
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
                <div style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">🕉️⚡</div>
                <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.4rem;">Pathanamthitta Quote Request Received!</h3>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    <strong>${formData.name}</strong>, we'll contact you shortly at 
                    <strong>${formData.phone}</strong> for your <strong>${formData.service} Solar</strong> 
                    needs in <strong>${formData.area}</strong>, Pathanamthitta.
                </p>
                <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1.5rem;">
                    Our Pathanamthitta team will reach out within 30 minutes.
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

    function showPathanamthittaCoverageInfo() {
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
                <h4 style="color: var(--primary); margin-bottom: 1rem;">Pathanamthitta District Coverage</h4>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    We serve the entire Pathanamthitta district including pilgrimage centers, towns, and rural areas with complete solar solutions.
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

    function showPathanamthittaServiceInfo(serviceType) {
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
                    ${getPathanamthittaServiceDescription(serviceType)}
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

    function getPathanamthittaServiceDescription(serviceType) {
        const descriptions = {
            'Immediate Service (0-5 km)': 'Quick response service within Pathanamthitta town and immediate surroundings.',
            'Quick Service (5-10 km)': 'Efficient service to nearby towns and pilgrimage centers around Pathanamthitta.',
            'Extended Service (10-15 km)': 'Complete coverage across Pathanamthitta district including remote areas.'
        };
        return descriptions[serviceType] || 'Professional solar service across Pathanamthitta region.';
    }

    function addPathanamthittaTheme() {
        // Add Pathanamthitta specific theme class to areas
        const areasSection = document.querySelector('.areas-covered');
        if (areasSection) {
            areasSection.classList.add('pathanamthitta-theme');
        }
        
        // Add pilgrimage-inspired styling to area categories
        const areaCategories = document.querySelectorAll('.area-category');
        areaCategories.forEach(category => {
            category.style.background = 'linear-gradient(135deg, #f8f9fa 0%, #e8f5e8 100%)';
        });
    }

    // Add CSS for Pathanamthitta specific animations
    const pathanamthittaStyles = document.createElement('style');
    pathanamthittaStyles.textContent = `
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
        
        .pathanamthitta-error-message {
            animation: slideInDown 0.5s ease;
        }
        
        .pathanamthitta-success-message {
            animation: fadeInScale 0.5s ease;
        }
        
        .coverage-info-message, .service-info-message {
            animation: fadeInScale 0.4s ease;
        }
        
        @keyframes fadeInScale {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Pathanamthitta specific area animations */
        .pathanamthitta-theme .area-item {
            animation: fadeInUp 0.6s ease forwards;
        }
    `;
    document.head.appendChild(pathanamthittaStyles);

    // Initialize Pathanamthitta specific features
    initPathanamthittaFeatures();
});

// Pathanamthitta page load effects
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
    
    // Add Pathanamthitta welcome effect
    console.log('🕉️ Welcome to Solis Green India - Pathanamthitta Solar Solutions ⚡');
    
    // Initialize area items animations
    const areaItems = document.querySelectorAll('.area-item');
    areaItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});
