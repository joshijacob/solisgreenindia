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
                background: radial-gradient(circle, var(--
