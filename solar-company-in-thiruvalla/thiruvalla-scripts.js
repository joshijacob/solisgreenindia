// Thiruvalla Specific JavaScript - Golden Agricultural Theme
// This file should be placed in solar-company-in-thiruvalla/ folder

document.addEventListener('DOMContentLoaded', function() {
    // Thiruvalla specific features with golden theme
    function initThiruvallaFeatures() {
        // Initialize enhanced golden cursor trail
        initGoldenCursorTrail();
        
        // Animate stats counting for Thiruvalla
        animateThiruvallaStats();
        
        // Interactive golden map for coverage
        initGoldenMap();
        
        // Area selection for Thiruvalla form
        initThiruvallaAreaSelection();
        
        // Thiruvalla specific form handling
        initThiruvallaForm();
        
        // Add golden theme animations
        addGoldenThemeAnimations();
        
        // Initialize hero with agricultural effects
        initAgriculturalHero();
        
        // Add golden interactive effects
        initGoldenInteractiveEffects();
    }

    function initGoldenCursorTrail() {
        const cursor = document.querySelector('.cursor-trail');
        const sparkle = document.querySelector('.golden-sparkle');
        if (!cursor || !sparkle) return;
        
        // Check if user prefers reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }
        
        let mouseX = 0, mouseY = 0;
        let trailParticles = [];
        let sparkleParticles = [];
        
        // Create golden trail particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'trail-particle';
            particle.style.background = getGoldenColor();
            document.body.appendChild(particle);
            trailParticles.push({
                element: particle,
                x: 0, y: 0,
                active: false
            });
        }
        
        // Create sparkle particles
        for (let i = 0; i < 10; i++) {
            const sparkleParticle = document.createElement('div');
            sparkleParticle.className = 'golden-sparkle';
            sparkleParticle.style.background = getGoldenSparkleColor();
            document.body.appendChild(sparkleParticle);
            sparkleParticles.push({
                element: sparkleParticle,
                active: false
            });
        }
        
        let particleIndex = 0;
        let sparkleIndex = 0;
        let lastTime = 0;
        const throttleDelay = 16; // ~60fps
        
        // Enhanced mouse move with golden effects
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
            
            // Update sparkle position
            sparkle.style.left = (mouseX - 3) + 'px';
            sparkle.style.top = (mouseY - 3) + 'px';
            
            // Create golden trail particle
            if (trailParticles.length > 0) {
                const particle = trailParticles[particleIndex];
                particle.element.style.left = (mouseX - 2) + 'px';
                particle.element.style.top = (mouseY - 2) + 'px';
                particle.element.style.animation = 'none';
                particle.element.offsetHeight; // Trigger reflow
                particle.element.style.animation = 'goldenTrailFade 0.6s ease-out forwards';
                
                particleIndex = (particleIndex + 1) % trailParticles.length;
            }
            
            // Occasionally create sparkle particles
            if (Math.random() > 0.7 && sparkleParticles.length > 0) {
                const sparkleParticle = sparkleParticles[sparkleIndex];
                sparkleParticle.element.style.left = (mouseX + (Math.random() * 20 - 10)) + 'px';
                sparkleParticle.element.style.top = (mouseY + (Math.random() * 20 - 10)) + 'px';
                sparkleParticle.element.style.animation = 'none';
                sparkleParticle.element.offsetHeight;
                sparkleParticle.element.style.animation = 'sparkleTrail 0.8s ease-out forwards';
                
                sparkleIndex = (sparkleIndex + 1) % sparkleParticles.length;
            }
        });
        
        // Mouse leave event
        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
        
        // Enhanced golden click effect
        document.addEventListener('click', (e) => {
            createGoldenClickEffect(e.clientX, e.clientY);
            createAgriculturalRipple(e.clientX, e.clientY);
        });
        
        function getGoldenColor() {
            const colors = [
                '#FFD700', '#FFC107', '#FFB300', 
                '#FFA000', '#FF8F00', '#FF6F00'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function getGoldenSparkleColor() {
            const colors = [
                '#FFD700', '#FFF8DC', '#FFECB3',
                '#FFFDE7', '#FFF9C4'
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        function createGoldenClickEffect(x, y) {
            const effect = document.createElement('div');
            effect.style.cssText = `
                position: fixed;
                width: 60px;
                height: 60px;
                border: 3px solid var(--golden-primary);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x - 30}px;
                top: ${y - 30}px;
                animation: goldenClickEffect 0.8s ease-out forwards;
                box-shadow: 0 0 30px var(--golden-primary);
            `;
            
            document.body.appendChild(effect);
            
            setTimeout(() => {
                effect.remove();
            }, 800);
        }
        
        function createAgriculturalRipple(x, y) {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: fixed;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle, var(--agricultural-green) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 9998;
                left: ${x - 10}px;
                top: ${y - 10}px;
                animation: agriculturalRipple 1s ease-out forwards;
            `;
            
            document.body.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 1000);
        }
        
        // Add enhanced animations to styles
        const enhancedStyles = document.createElement('style');
        enhancedStyles.textContent = `
            @keyframes goldenClickEffect {
                0% {
                    transform: scale(0);
                    opacity: 1;
                    border-width: 3px;
                }
                50% {
                    opacity: 0.7;
                    border-width: 1px;
                }
                100% {
                    transform: scale(3);
                    opacity: 0;
                    border-width: 0px;
                }
            }
            
            @keyframes agriculturalRipple {
                0% {
                    transform: scale(1);
                    opacity: 0.8;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(enhancedStyles);
    }

    function initAgriculturalHero() {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Add agricultural floating elements
            createFarmingElements(heroSection);
            
            // Add golden particles
            createGoldenParticles(heroSection.querySelector('.golden-particles'));
            
            // Animate hero elements
            const heroElements = heroSection.querySelectorAll('.golden-title, .golden-subtitle, .hero-buttons');
            heroElements.forEach((element, index) => {
                element.style.animation = `fadeInUp 1s ease ${index * 0.2}s both`;
            });
        }
    }

    function createFarmingElements(container) {
        // Add paddy field waves
        for (let i = 0; i < 3; i++) {
            const wave = document.createElement('div');
            wave.style.cssText = `
                position: absolute;
                width: 100%;
                height: 20px;
                background: linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent);
                bottom: ${i * 30}px;
                animation: paddyWave 4s ease-in-out infinite;
                animation-delay: ${i * 1.5}s;
                pointer-events: none;
                opacity: 0.3;
            `;
            container.appendChild(wave);
        }
        
        // Add floating agricultural icons
        const icons = ['🌾', '🚜', '🌻', '💧'];
        icons.forEach((icon, index) => {
            const element = document.createElement('div');
            element.style.cssText = `
                position: absolute;
                font-size: 2rem;
                animation: floatIcon 15s linear infinite;
                animation-delay: ${index * 3}s;
                pointer-events: none;
                opacity: 0.1;
                left: ${Math.random() * 100}%;
            `;
            element.textContent = icon;
            container.appendChild(element);
        });
        
        // Add animations to styles
        const farmingStyles = document.createElement('style');
        farmingStyles.textContent = `
            @keyframes paddyWave {
                0%, 100% { transform: translateX(0px) scaleY(1); }
                50% { transform: translateX(20px) scaleY(1.2); }
            }
            
            @keyframes floatIcon {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.1;
                }
                90% {
                    opacity: 0.1;
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(farmingStyles);
    }

    function createGoldenParticles(container) {
        if (!container) return;
        
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--golden-primary);
                border-radius: 50%;
                animation: goldenParticleFloat 8s linear infinite;
                animation-delay: ${Math.random() * 8}s;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${0.1 + Math.random() * 0.2};
                box-shadow: 0 0 10px var(--golden-primary);
            `;
            container.appendChild(particle);
        }
        
        const particleStyles = document.createElement('style');
        particleStyles.textContent = `
            @keyframes goldenParticleFloat {
                0% {
                    transform: translateY(0px) translateX(0px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.3;
                }
                90% {
                    opacity: 0.3;
                }
                100% {
                    transform: translateY(-100px) translateX(50px) rotate(180deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(particleStyles);
    }

    function initGoldenInteractiveEffects() {
        // Add golden ripple effects to interactive elements
        const interactiveElements = document.querySelectorAll('.btn-golden, .golden-area, .golden-legend, .golden-card');
        
        interactiveElements.forEach(element => {
            const goldenRippleHandler = function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    width: 0;
                    height: 0;
                    background: radial-gradient(circle, var(--golden-primary) 0%, transparent 70%);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    animation: goldenRippleEffect 0.8s ease-out;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.remove();
                    }
                }, 800);
            };
            
            element.addEventListener('mouseenter', goldenRippleHandler);
            element._goldenRippleHandler = goldenRippleHandler;
        });
        
        // Add golden ripple animation
        const goldenRippleStyle = document.createElement('style');
        goldenRippleStyle.textContent = `
            @keyframes goldenRippleEffect {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 0.7;
                }
                100% {
                    width: 400px;
                    height: 400px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(goldenRippleStyle);
    }

    function animateThiruvallaStats() {
        const statItems = document.querySelectorAll('.golden-stat');
        
        statItems.forEach(stat => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const statNumber = stat.querySelector('.stat-number');
                        const targetText = statNumber.textContent;
                        
                        if (targetText.includes('km')) {
                            const targetNumber = parseInt(targetText);
                            animateNumber(statNumber, 0, targetNumber, 1500, 'km');
                        } else if (targetText.includes('/')) {
                            statNumber.textContent = '24/7';
                        } else {
                            const targetNumber = parseInt(targetText);
                            animateNumber(statNumber, 0, targetNumber, 2000, '+');
                        }
                        
                        // Add golden glow effect
                        stat.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';
                        setTimeout(() => {
                            stat.style.boxShadow = '';
                        }, 1000);
                        
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
            
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const value = Math.floor(easeOutQuart * (end - start) + start);
            
            element.textContent = value + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }

    function initGoldenMap() {
        const legendItems = document.querySelectorAll('.golden-legend');
        const rings = document.querySelectorAll('.golden-ring');
        
        legendItems.forEach((item, index) => {
            item.addEventListener('mouseenter', () => {
                if (rings[index]) {
                    rings[index].style.animationPlayState = 'paused';
                    rings[index].style.borderStyle = 'solid';
                    rings[index].style.borderWidth = '4px';
                    rings[index].style.fontWeight = 'bold';
                    rings[index].style.background = 'rgba(255, 215, 0, 0.2)';
                    rings[index].style.boxShadow = '0 0 20px var(--golden-primary)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                if (rings[index]) {
                    rings[index].style.animationPlayState = 'running';
                    rings[index].style.borderStyle = 'dashed';
                    rings[index].style.borderWidth = '3px';
                    rings[index].style.fontWeight = '600';
                    rings[index].style.background = 'rgba(255, 248, 220, 0.9)';
                    rings[index].style.boxShadow = 'none';
                }
            });
            
            item.addEventListener('click', function() {
                const serviceType = this.querySelector('span:last-child').textContent;
                showThiruvallaServiceInfo(serviceType);
            });
        });

        // Enhanced central point interaction
        const centralPoint = document.querySelector('.golden-center');
        if (centralPoint) {
            centralPoint.addEventListener('click', function() {
                showThiruvallaCoverageInfo();
                // Add golden pulse effect
                this.style.animation = 'none';
                this.offsetHeight;
                this.style.animation = 'goldenPulse 0.5s ease';
            });
        }
    }

    function initThiruvallaAreaSelection() {
        const areaItems = document.querySelectorAll('.golden-area');
        const areaSelect = document.querySelector('select.golden-input');
        
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
                    handleThiruvallaAreaSelection(item, areaSelect);
                }
            });
            
            // Click support
            item.addEventListener('click', () => {
                handleThiruvallaAreaSelection(item, areaSelect);
            });
        });
        
        function handleThiruvallaAreaSelection(item, areaSelect) {
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
                
                // Golden scroll to contact form
                const contactForm = document.querySelector('.golden-form');
                if (contactForm) {
                    contactForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Golden highlight effect
                    contactForm.style.transform = 'scale(1.02)';
                    contactForm.style.boxShadow = '0 0 30px rgba(255, 215, 0, 0.3)';
                    contactForm.style.transition = 'all 0.3s ease';
                    setTimeout(() => {
                        contactForm.style.transform = 'scale(1)';
                        contactForm.style.boxShadow = '';
                    }, 500);
                }
                
                // Show golden selection feedback
                showThiruvallaSelectionFeedback(areaName);
            }
        }
    }

    function showThiruvallaSelectionFeedback(areaName) {
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
                background: linear-gradient(45deg, var(--golden-primary), var(--golden-secondary));
                color: var(--dark);
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 5px 25px rgba(255, 215, 0, 0.4);
                z-index: 10000;
                animation: slideInRight 0.5s ease;
                border-left: 4px solid var(--golden-dark);
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
            ">
                <i class="fas fa-check-circle"></i>
                <div>
                    <strong>${areaName}</strong> selected for agricultural solar quote!
                </div>
            </div>
        `;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    function initThiruvallaForm() {
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
                // Golden loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitButton.disabled = true;
                submitButton.style.background = 'linear-gradient(45deg, var(--golden-dark), var(--golden-secondary))';
                
                const formData = {
                    name: this.querySelector('input[type="text"]').value.trim(),
                    phone: this.querySelector('input[type="tel"]').value.trim(),
                    area: this.querySelector('select[placeholder*="Area"]').value,
                    service: this.querySelector('select[placeholder*="Interested"]').value
                };
                
                if (validateThiruvallaForm(formData)) {
                    await submitThiruvallaForm(formData);
                    showThiruvallaSuccess(formData);
                    this.reset();
                }
                
            } catch (error) {
                console.error('Form submission error:', error);
                showThiruvallaError('Failed to submit form. Please try again.');
            } finally {
                // Reset golden button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.style.background = '';
                isSubmitting = false;
            }
        });
    }

    function validateThiruvallaForm(formData) {
        if (!formData.name || !formData.phone || !formData.area || !formData.service) {
            showThiruvallaError('Please fill all required fields for agricultural solar quote');
            return false;
        }
        
        if (formData.phone.length < 10) {
            showThiruvallaError('Please enter a valid phone number');
            return false;
        }
        
        return true;
    }

    function submitThiruvallaForm(formData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Thiruvalla agricultural form submitted:', formData);
                resolve();
            }, 1000);
        });
    }

    function showThiruvallaError(message) {
        const errorMessage = document.createElement('div');
        errorMessage.className = 'thiruvalla-error-message';
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
                box-shadow: 0 5px 25px rgba(255, 215, 0, 0.3);
                z-index: 10000;
                animation: slideInDown 0.5s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                border-left: 4px solid #d32f2f;
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

    function showThiruvallaSuccess(formData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'thiruvalla-success-message';
        successMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--white) 0%, var(--golden-light) 100%);
                padding: 2.5rem;
                border-radius: 20px;
                box-shadow: 0 25px 60px rgba(255, 215, 0, 0.4);
                z-index: 10000;
                text-align: center;
                border: 2px solid var(--golden-primary);
                max-width: 400px;
                width: 90%;
            ">
                <div style="font-size: 4rem; margin-bottom: 1rem;">🌾⚡</div>
                <h3 style="color: var(--golden-dark); margin-bottom: 1rem; font-size: 1.4rem; font-weight: 700;">
                    Agricultural Solar Quote Received!
                </h3>
                <p style="margin-bottom: 1rem; color: var(--dark); line-height: 1.6;">
                    <strong>${formData.name}</strong>, we'll contact you shortly at 
                    <strong style="color: var(--golden-dark);">${formData.phone}</strong> for your 
                    <strong style="color: var(--golden-dark);">${formData.service} Solar</strong> 
                    needs in <strong style="color: var(--golden-dark);">${formData.area}</strong>, Thiruvalla.
                </p>
                <p style="font-size: 0.9rem; color: var(--earth-brown); margin-bottom: 1.5rem; font-style: italic;">
                    Our agricultural solar experts will reach out within 30 minutes.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: linear-gradient(45deg, var(--golden-primary), var(--golden-secondary));
                    color: var(--dark);
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: 700;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255, 215, 0, 0.5)'" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(255, 215, 0, 0.3)'">
                    Close
                </button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(139, 69, 19, 0.7);
                z-index: 9999;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(successMessage);
    }

    function showThiruvallaCoverageInfo() {
        const infoMessage = document.createElement('div');
        infoMessage.className = 'coverage-info-message';
        infoMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--white) 0%, var(--golden-light) 100%);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 20px 50px rgba(255, 215, 0, 0.3);
                z-index: 10000;
                text-align: center;
                max-width: 350px;
                width: 90%;
                border: 2px solid var(--golden-primary);
            ">
                <h4 style="color: var(--golden-dark); margin-bottom: 1rem; font-weight: 700;">Central Travancore Coverage</h4>
                <p style="margin-bottom: 1rem; color: var(--dark); line-height: 1.6;">
                    We serve the entire Thiruvalla region including agricultural lands, paddy fields, riverbanks, and rural communities with specialized solar solutions for farming and residential needs.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--golden-primary);
                    color: var(--dark);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                ">Got it</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(139, 69, 19, 0.5);
                z-index: 9999;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(infoMessage);
    }

    function showThiruvallaServiceInfo(serviceType) {
        const infoMessage = document.createElement('div');
        infoMessage.className = 'service-info-message';
        infoMessage.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, var(--white) 0%, var(--golden-light) 100%);
                padding: 2rem;
                border-radius: 15px;
                box-shadow: 0 20px 50px rgba(255, 215, 0, 0.3);
                z-index: 10000;
                text-align: center;
                max-width: 350px;
                width: 90%;
                border: 2px solid var(--golden-primary);
            ">
                <h4 style="color: var(--golden-dark); margin-bottom: 1rem; font-weight: 700;">${serviceType}</h4>
                <p style="margin-bottom: 1rem; color: var(--dark); line-height: 1.6;">
                    ${getThiruvallaServiceDescription(serviceType)}
                </p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--golden-primary);
                    color: var(--dark);
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 600;
                ">Understand</button>
            </div>
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(139, 69, 19, 0.5);
                z-index: 9999;
            " onclick="this.parentElement.remove()"></div>
        `;
        document.body.appendChild(infoMessage);
    }

    function getThiruvallaServiceDescription(serviceType) {
        const descriptions = {
            'Town Service (0-10 km)': 'Immediate service within Thiruvalla town and commercial areas with quick response times for urban solar needs.',
            'Village Service (10-20 km)': 'Specialized service to surrounding villages and agricultural areas with focus on farming solar solutions.',
            'Regional Service (20-30 km)': 'Complete coverage across Central Travancore region including remote agricultural communities.'
        };
        return descriptions[serviceType] || 'Professional agricultural solar service across Thiruvalla region.';
    }

    function addGoldenThemeAnimations() {
        // Add CSS for golden animations
        const goldenAnimations = document.createElement('style');
        goldenAnimations.textContent = `
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
            
            .thiruvalla-error-message {
                animation: slideInDown 0.5s ease;
            }
            
            .thiruvalla-success-message {
                animation: fadeInScale 0.5s ease;
            }
            
            .coverage-info-message, .service-info-message {
                animation: fadeInScale 0.4s ease;
            }
            
            @keyframes fadeInScale {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(goldenAnimations);
    }

    // Initialize Thiruvalla specific features
    initThiruvallaFeatures();
});

// Thiruvalla page load effects
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
    
    // Add agricultural welcome effect
    console.log('🌾 Welcome to Solis Green India - Thiruvalla Agricultural Solar Solutions ⚡');
    
    // Initialize golden area items animations
    const areaItems = document.querySelectorAll('.golden-area');
    areaItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});

// Cleanup function for golden effects
function cleanupThiruvallaFeatures() {
    const interactiveElements = document.querySelectorAll('.btn-golden, .golden-area, .golden-legend, .golden-card');
    interactiveElements.forEach(element => {
        if (element._goldenRippleHandler) {
            element.removeEventListener('mouseenter', element._goldenRippleHandler);
        }
    });
    
    // Remove dynamically added styles
    const dynamicStyles = document.querySelectorAll('style');
    dynamicStyles.forEach(style => {
        if (style.textContent.includes('golden') || style.textContent.includes('agricultural')) {
            style.remove();
        }
    });
}

// Add cleanup on page unload
window.addEventListener('beforeunload', cleanupThiruvallaFeatures);

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, reduce animations
        const cursor = document.querySelector('.cursor-trail');
        if (cursor) {
            cursor.style.display = 'none';
        }
    } else {
        // Page is visible, restore animations
        const cursor = document.querySelector('.cursor-trail');
        if (cursor && window.matchMedia('(min-width: 769px)').matches) {
            cursor.style.display = 'block';
        }
    }
});
