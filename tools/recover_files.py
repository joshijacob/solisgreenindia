import os
import sys

# 1. Read the base backup
base_index = open(r'd:\temp_restore\index.html', encoding='utf-8').read()

# 2. Replace headers and footer (mimic replace_headers.py)
# Headers
h_start = base_index.find('<header class="main-header">')
h_end = base_index.find('</header>') + len('</header>')
if h_start != -1 and h_end != -1:
    base_index = base_index[:h_start] + '<div id="header-placeholder"></div>' + base_index[h_end:]

# Footer
f_start = base_index.find('<footer class="main-footer">')
f_end = base_index.find('</footer>') + len('</footer>')
if f_start != -1 and f_end != -1:
    base_index = base_index[:f_start] + '<div id="footer-placeholder"></div>' + base_index[f_end:]


# 3. Add Premium CTA (mimic update_cta.py)
cta_start = base_index.find('<!-- ========== FINAL CALL TO ACTION ========== -->')
cta_end = base_index.find('<!-- ========== PREMIUM FOOTER ========== -->')
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
if cta_start != -1 and cta_end != -1:
    base_index = base_index[:cta_start] + new_cta + base_index[cta_end:]


# 4. Replace Useful Links with New CTA (mimic move_resources.py)
links_start = base_index.find('<!-- ========== USEFUL LINKS ========== -->')
# We need to replace up to the next section
links_end = base_index.find('</section>', links_start) + len('</section>')
links_cta = """  <!-- ========== USEFUL RESOURCES CTA ========== -->
  <section class="section-light" style="padding: 60px 0; background-color: #f7f9fc;">
    <div class="container" style="text-align: center; max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 2rem; color: #111827; margin-bottom: 15px; font-weight: 800;">Planning your solar project?</h2>
      <p style="font-size: 1.1rem; color: #4b5563; margin-bottom: 30px;">Explore our free Solar Calculators, EMI Estimators, and official KSEB & Government Guidelines.</p>
      <a href="/useful-resources/" class="btn btn-primary" style="font-size: 1rem; padding: 12px 24px;">Explore Useful Resources <i class="fas fa-arrow-right" style="margin-left: 8px;"></i></a>
    </div>
  </section>"""
if links_start != -1:
    base_index = base_index[:links_start] + links_cta + base_index[links_end:]


# 5. Update Trust Bar (mimic update_trust.py)
trust_start = base_index.find('<!-- ========== TRUST STRIP ========== -->')
trust_end = base_index.find('</section>', trust_start) + len('</section>')
new_trust_html = """<!-- ========== TRUST STRIP ========== -->
  <section class="trust-bar-section">
    <div class="container">
      <div class="trust-grid">
        <div class="trust-item">
          <i class="fas fa-certificate" style="color: #ea580c;"></i>
          <span><strong>PM Surya Ghar</strong><br>Empaneled Vendor</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-bolt" style="color: #22c55e;"></i>
          <span><strong>KSEB Approved</strong><br>Solar Installer</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-handshake" style="color: #3b82f6;"></i>
          <span><strong>Tata Power</strong><br>Installation Partner</span>
        </div>
        <div class="trust-item">
          <i class="fas fa-medal" style="color: #eab308;"></i>
          <span><strong>Enphase</strong><br>Gold Installer</span>
        </div>
      </div>
    </div>
  </section>"""
if trust_start != -1:
    base_index = base_index[:trust_start] + new_trust_html + base_index[trust_end:]

# 6. Save recovered index.html
open(r'd:\Antigravity\solisgreenindia.in\index.html', 'w', encoding='utf-8').write(base_index)
print("Successfully recovered index.html!")

# 7. Recover useful-resources/index.html
# It should contain the boilerplate + contents of resources-section.html
res_section = open(r'd:\Antigravity\solisgreenindia.in\resources-section.html', encoding='utf-8').read()

# Add detailed accreditations block that I added in update_trust.py
detailed_accreditations = """
    <!-- ACCREDITATIONS (Detailed) -->
    <div class="prh-section-box" style="background: linear-gradient(to right, #f8fafc, #eff6ff); border: 1px solid #bfdbfe;">
      <div class="prh-box-header">
        <div class="prh-box-header-left">
          <div class="prh-num-badge" style="background: #3b82f6;"><i class="fas fa-award"></i></div>
          <div class="prh-box-title-area">
            <h3>Official Accreditations & Partnerships</h3>
            <p>Solis Green Energy Solutions is officially certified by leading authorities</p>
          </div>
        </div>
      </div>
      
      <div class="prh-tools-grid">
        <div class="prh-card" style="background: white;">
          <div class="prh-card-icon-top icon-orange"><i class="fas fa-certificate"></i></div>
          <h4>PM Surya Ghar Vendor</h4>
          <p>Officially empaneled vendor under the PM Surya Ghar Muft Bijli Yojana. We handle all subsidy documentation for you.</p>
        </div>
        
        <div class="prh-card" style="background: white;">
          <div class="prh-card-icon-top icon-green"><i class="fas fa-bolt"></i></div>
          <h4>KSEB Approved</h4>
          <p>Fully authorized and approved by KSEB for net metering installations across Kerala.</p>
        </div>
        
        <div class="prh-card" style="background: white;">
          <div class="prh-card-icon-top icon-blue"><i class="fas fa-handshake"></i></div>
          <h4>Tata Power Partner</h4>
          <p>Official installation partner for Tata Power Solar, ensuring premium tier-1 equipment and service.</p>
        </div>

        <div class="prh-card" style="background: white;">
          <div class="prh-card-icon-top" style="color: #eab308; background: #fefce8;"><i class="fas fa-medal"></i></div>
          <h4>Enphase Gold Installer</h4>
          <p>Certified Gold Installer for Enphase Microinverters, providing the highest standard of safety and efficiency.</p>
        </div>
      </div>
    </div>
"""

insert_pos = res_section.find('<!-- SECTION 1: POPULAR TOOLS & CALCULATORS -->')
if insert_pos != -1:
    res_section = res_section[:insert_pos] + detailed_accreditations + "\n    " + res_section[insert_pos:]

page_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO Meta Tags -->
    <title>Useful Resources & Solar Calculators | Solis Green Energy Solutions</title>
    <meta name="description" content="Calculate your solar savings, EMI, and roof area. Find official KSEB guidelines, PM Surya Ghar subsidy details, and solar finance tools.">
    <meta name="keywords" content="solar calculators kerala, kseb solar guidelines, pm surya ghar subsidy portal, solar emi calculator">
    <meta name="author" content="Solis Green Energy Solutions">
    
    <!-- OG Tags -->
    <meta property="og:title" content="Useful Resources & Solar Calculators | Solis Green">
    <meta property="og:description" content="Calculate your solar savings, EMI, and roof area. Official government portals and tools.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://www.solisgreenindia.in/useful-resources/">
    <link rel="canonical" href="https://www.solisgreenindia.in/useful-resources/">
    
    <!-- Stylesheets -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/style.css?v=6">
</head>
<body>

    <!-- ========== HEADER ========== -->
    <div id="header-placeholder"></div>

    <!-- ========== MAIN CONTENT ========== -->
    <main>
{res_section}
    </main>

    <!-- ========== FOOTER ========== -->
    <div id="footer-placeholder"></div>

    <!-- JavaScript -->
    <script src="/script.js?v=6" defer></script>
</body>
</html>
"""
open(r'd:\Antigravity\solisgreenindia.in\useful-resources\index.html', 'w', encoding='utf-8').write(page_content)
print("Successfully recovered useful-resources/index.html!")
