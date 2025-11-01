// Kottayam Specific JavaScript - Dedicated to this location only

document.addEventListener('DOMContentLoaded', function() {
    // Kottayam specific area interactions
    function initKottayamFeatures() {
        // Animate stats counting for Kottayam
        animateKottayamStats();
        
        // Interactive map for Kottayam coverage
        initKottayamMap();
        
        // Area selection for Kottayam form
        initKottayamAreaSelection();
        
        // Kottayam specific form handling
        initKottayamForm();
        
        // Add Kottayam theme
        addKottayamTheme();
    }

    function animateKottayamStats() {
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

    function initKottayamMap() {
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
        });

        // Add click interaction to central point
        const centralPoint = document.querySelector('.central-point');
        if (centralPoint) {
            centralPoint.style.cursor = 'pointer';
            centralPoint.addEventListener('click', function() {
                showKottayamCoverageInfo();
            });
        }
    }

    function initKottayamAreaSelection() {
        const areaItems = document.querySelectorAll('.area-item');
        const areaSelect = document.querySelector('select[placeholder*="Area"]');
        
        areaItems.forEach(item => {
            item.style.cursor = 'pointer';
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
            ">
                <i class="fas fa-check-circle"></i>
                <strong>${areaName}</strong> selected for Kottayam quote!
            </div>
        `;
        document.body.appendChild(feedback);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            feedback.remove();
        }, 3000);
    }

    function initKottayamForm() {
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
                
                // Kottayam specific success message
                showKottayamSuccess(formData);
                
                // Reset form
                this.reset();
            });
        }
    }

    function showKottayamSuccess(formData) {
        const successMessage = document.createElement('div');
        successMessage.className = 'kottayam-success-message';
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
                <div style="font-size: 3rem; color: var(--primary); margin-bottom: 1rem;">🌊⚡</div>
                <h3 style="color: var(--primary); margin-bottom: 1rem; font-size: 1.4rem;">Kottayam Quote Request Received!</h3>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    <strong>${formData.name}</strong>, we'll contact you shortly at 
                    <strong>${formData.phone}</strong> for your <strong>${formData.service} Solar</strong> 
                    needs in <strong>${formData.area}</strong>, Kottayam.
                </p>
                <p style="font-size: 0.9rem; color: var(--gray); margin-bottom: 1.5rem;">
                    Our Kottayam team will reach out within 30 minutes.
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

    function showKottayamCoverageInfo() {
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
                <h4 style="color: var(--primary); margin-bottom: 1rem;">Kottayam District Coverage</h4>
                <p style="margin-bottom: 1rem; color: var(--dark);">
                    We serve the entire Kottayam district within 30km radius, including city areas, major towns, and backwater regions.
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

    function addKottayamTheme() {
        // Add Kottayam specific theme class
        const areasSection = document.querySelector('.areas-covered');
        if (areasSection) {
            areasSection.classList.add('kottayam-theme');
        }
        
        // Add backwater inspired animations
        const areaItems = document.querySelectorAll('.area-item');
        areaItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // Add CSS for Kottayam specific animations
    const kottayamStyles = document.createElement('style');
    kottayamStyles.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        .area-selection-feedback {
            animation: slideInRight 0.5s ease;
        }
        
        .kottayam-success-message {
            animation: fadeInScale 0.5s ease;
        }
        
        .coverage-info-message {
            animation: fadeInScale 0.4s ease;
        }
        
        @keyframes fadeInScale {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        /* Kottayam specific animations */
        .kottayam-theme .area-item {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(kottayamStyles);

    // Initialize Kottayam specific features
    initKottayamFeatures();
});

// Kottayam page load effects
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
    
    // Add Kottayam welcome effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0f9ff 100%)';
    }
});
