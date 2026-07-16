import os

# 1. Update style.css
css_path = r'd:\Antigravity\solisgreenindia.in\style.css'
css_content = open(css_path, encoding='utf-8').read()

new_trust_css = """
/* ========== TRUST BAR ========== */
.trust-bar-section {
  background-color: #ffffff;
  padding: 20px 0;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.trust-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.trust-item i {
  font-size: 32px;
}

.trust-item span {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.3;
}

@media (max-width: 992px) {
  .trust-grid {
    justify-content: space-around;
  }
}
@media (max-width: 576px) {
  .trust-grid {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
"""
if '.trust-bar-section' not in css_content:
    open(css_path, 'a', encoding='utf-8').write("\n" + new_trust_css)


# 2. Update index.html
index_path = r'd:\Antigravity\solisgreenindia.in\index.html'
index_content = open(index_path, encoding='utf-8').read()

old_benefits_bar_start = index_content.find('<!-- ========== TRUST STRIP ========== -->')
old_benefits_bar_end = index_content.find('</section>', old_benefits_bar_start) + 10

if old_benefits_bar_start != -1:
    new_trust_html = """  <!-- ========== TRUST STRIP ========== -->
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
    new_index = index_content[:old_benefits_bar_start] + new_trust_html + index_content[old_benefits_bar_end:]
    open(index_path, 'w', encoding='utf-8').write(new_index)
    print("Updated index.html")


# 3. Update useful-resources/index.html
res_path = r'd:\Antigravity\solisgreenindia.in\useful-resources\index.html'
res_content = open(res_path, encoding='utf-8').read()

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

if 'Official Accreditations & Partnerships' not in res_content:
    insert_pos = res_content.find('<!-- SECTION 1: POPULAR TOOLS & CALCULATORS -->')
    if insert_pos != -1:
        new_res = res_content[:insert_pos] + detailed_accreditations + "\n    " + res_content[insert_pos:]
        open(res_path, 'w', encoding='utf-8').write(new_res)
        print("Updated useful-resources/index.html")
