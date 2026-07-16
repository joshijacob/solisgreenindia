import sys

content = open(r'd:\Antigravity\solisgreenindia.in\index.html', encoding='utf-8').read()
idx1 = content.find('<!-- ========== FINAL CALL TO ACTION ========== -->')
idx2 = content.find('<!-- ========== PREMIUM FOOTER ========== -->')

if idx1 == -1 or idx2 == -1:
    print("Could not find replacement indices.")
    sys.exit(1)

new_cta = """<!-- ========== PREMIUM FINAL CALL TO ACTION ========== -->
  <section class="premium-cta-section">
    <div class="container">
      <div class="premium-cta-card">
        <div class="premium-cta-image">
          <img src="/images/hero/hero-image-2.webp" alt="Solar Panels on Kerala Home" loading="lazy">
        </div>
        <div class="premium-cta-content">
          <h3>Not sure which system is right for you?</h3>
          <p>Get a free site survey, subsidy guidance and EMI assistance from Solis Green Energy Solutions.</p>
          
          <div class="premium-cta-buttons">
            <a href="tel:8301849474" class="pcta-btn pcta-btn-orange">
              <div class="pcta-icon"><i class="fas fa-phone-alt"></i></div>
              <div class="pcta-text">
                <span class="pcta-title">Call Now</span>
                <span class="pcta-sub">83018 49474</span>
              </div>
            </a>

            <a href="https://wa.me/918301849474" class="pcta-btn pcta-btn-green" target="_blank">
              <div class="pcta-icon"><i class="fab fa-whatsapp"></i></div>
              <div class="pcta-text">
                <span class="pcta-title">WhatsApp</span>
                <span class="pcta-sub">Chat with Expert</span>
              </div>
            </a>

            <a href="/contact/" class="pcta-btn pcta-btn-white">
              <div class="pcta-icon"><i class="fas fa-file-invoice-dollar"></i></div>
              <div class="pcta-text">
                <span class="pcta-title">Get Free Quote</span>
                <span class="pcta-sub">Quick Response</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  """

open(r'd:\Antigravity\solisgreenindia.in\index.html', 'w', encoding='utf-8').write(content[:idx1] + new_cta + content[idx2:])
print("Successfully replaced CTA in index.html.")
