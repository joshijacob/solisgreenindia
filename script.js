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

// Existing functionality remains the same
// Mobile menu, smooth scrolling, form validation, etc.
