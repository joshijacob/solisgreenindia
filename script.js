// Floating CTA functionality
const ctaMainBtn = document.getElementById('ctaMainBtn');
const ctaOptions = document.querySelector('.cta-options');
const quickFormBtn = document.getElementById('quickFormBtn');
const quickQuoteModal = document.getElementById('quickQuoteModal');
const closeModal = document.querySelector('.close-modal');

// Toggle CTA options
ctaMainBtn.addEventListener('click', function() {
    ctaOptions.classList.toggle('active');
});

// Quick form modal
quickFormBtn.addEventListener('click', function(e) {
    e.preventDefault();
    quickQuoteModal.classList.add('active');
    ctaOptions.classList.remove('active');
});

closeModal.addEventListener('click', function() {
    quickQuoteModal.classList.remove('active');
});

// Close modal on outside click
quickQuoteModal.addEventListener('click', function(e) {
    if (e.target === quickQuoteModal) {
        quickQuoteModal.classList.remove('active');
    }
});

// Quick quote form submission
document.querySelector('.quick-quote-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you! We will contact you shortly with your quote.');
    this.reset();
    quickQuoteModal.classList.remove('active');
});

// Projects Filtering Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const explanations = document.querySelectorAll('.category-explanation');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    // Initialize with all projects and explanation visible
    const allExplanation = document.getElementById('explanation-all');
    if (allExplanation) {
        allExplanation.classList.add('active');
    }

    // Filter projects function
    function filterProjects(filterValue) {
        // Remove active class from all buttons and explanations
        filterButtons.forEach(btn => btn.classList.remove('active'));
        explanations.forEach(exp => exp.classList.remove('active'));
        
        // Add active class to clicked button
        const activeButton = Array.from(filterButtons).find(btn => btn.getAttribute('data-filter') === filterValue);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Show corresponding explanation
        const targetExplanation = document.getElementById(`explanation-${filterValue}`);
        if (targetExplanation) {
            targetExplanation.classList.add('active');
        }
        
        // Filter project cards with animation
        projectCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            
            if (filterValue === 'all' || cardCategory === filterValue) {
                // Show matching cards
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                // Hide non-matching cards with animation
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });

        // Show/hide load more button based on visible projects
        updateLoadMoreButton();
    }

    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');
            filterProjects(filterValue);
            
            // Update URL hash for deep linking
            window.location.hash = `filter-${filterValue}`;
        });
    });

    // Check URL hash on page load
    function checkUrlHash() {
        const hash = window.location.hash;
        if (hash) {
            const filterValue = hash.replace('#filter-', '');
            const validFilters = ['all', 'residential', 'commercial', 'industrial', 'agricultural'];
            
            if (validFilters.includes(filterValue)) {
                filterProjects(filterValue);
            }
        }
    }

    // Load more projects functionality
    let visibleProjects = 6; // Initial number of projects to show
    
    function updateLoadMoreButton() {
        const visibleCards = Array.from(projectCards).filter(card => 
            card.style.display !== 'none' && card.style.opacity !== '0'
        );
        
        if (loadMoreBtn) {
            if (visibleCards.length <= visibleProjects) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-flex';
            }
        }
        
        // Show/hide projects based on count
        projectCards.forEach((card, index) => {
            if (card.style.display !== 'none') {
                if (index < visibleProjects) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleProjects += 3;
            updateLoadMoreButton();
            
            // Smooth scroll to maintain position
            const projectsGrid = document.getElementById('projects-grid');
            if (projectsGrid) {
                projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Initialize
    updateLoadMoreButton();
    checkUrlHash();

    // Close CTA options when clicking outside
    document.addEventListener('click', function(e) {
        if (!ctaMainBtn.contains(e.target) && !ctaOptions.contains(e.target)) {
            ctaOptions.classList.remove('active');
        }
    });

    // Add smooth scrolling for anchor links
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

    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            this.setAttribute('aria-expanded', mainNav.classList.contains('active'));
        });

        // Close mobile menu when clicking on a link
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Form validation for contact forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            let isValid = true;
            const inputs = this.querySelectorAll('input[required], select[required], textarea[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#dc3545';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        quickQuoteModal.classList.remove('active');
        ctaOptions.classList.remove('active');
    }
    
    // Navigate filter buttons with arrow keys
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const activeFilter = document.querySelector('.filter-btn.active');
        if (activeFilter) {
            const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
            const currentIndex = filterButtons.indexOf(activeFilter);
            let nextIndex;
            
            if (e.key === 'ArrowRight') {
                nextIndex = (currentIndex + 1) % filterButtons.length;
            } else {
                nextIndex = (currentIndex - 1 + filterButtons.length) % filterButtons.length;
            }
            
            filterButtons[nextIndex].click();
            filterButtons[nextIndex].focus();
        }
    }
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
