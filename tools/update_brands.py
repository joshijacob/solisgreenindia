import re

new_grid_html = """      <div class="prh-partner-grid">
        <!-- Adani Solar -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #0b457a;">Adani <span style="font-weight:400;">Solar</span></span>
          </div>
          <h4>Adani Solar Panels</h4>
          <p>High-performance solar modules from India's leading energy conglomerate.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Premier Energies -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #10b981;">Premier <span style="font-weight:400;">Energies</span></span>
          </div>
          <h4>Premier Energies Modules</h4>
          <p>Advanced high-efficiency solar PV modules for maximum energy yield.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Waaree Energies -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #0b457a;">Waaree <span style="font-weight:400; color: #ea580c;">Energies</span></span>
          </div>
          <h4>Waaree Solar Panels</h4>
          <p>India's largest solar panel manufacturer with cutting-edge technology.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Emmvee -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #eab308;">EMMVEE</span>
          </div>
          <h4>Emmvee Photovoltaics</h4>
          <p>Premium quality solar modules with exceptional durability and performance.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Solis -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #ea580c;">Solis <span style="font-weight:400; color: #6b7280;">Inverters</span></span>
          </div>
          <h4>Solis Inverters</h4>
          <p>Leading global string inverter manufacturer for residential and commercial.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Growatt -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #10b981;">Growatt</span>
          </div>
          <h4>Growatt Inverters</h4>
          <p>Smart, reliable energy solutions and intelligent solar inverters.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Deye -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #3b82f6;">Deye</span>
          </div>
          <h4>Deye Inverters</h4>
          <p>Advanced hybrid inverters and complete energy storage solutions.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>

        <!-- Cathode Power -->
        <div class="prh-gov-card prh-card">
          <div class="prh-partner-logo">
             <span class="partner-logo-text" style="color: #dc2626;">Cathode <span style="font-weight:400;">Power</span></span>
          </div>
          <h4>Cathode Power</h4>
          <p>Innovative power electronics and robust solar energy solutions.</p>
          <a href="#" class="prh-link">Explore Now <i class="fas fa-arrow-right"></i></a>
        </div>
      </div>"""


files_to_update = [
    r'd:\Antigravity\solisgreenindia.in\useful-resources\index.html',
    r'd:\Antigravity\solisgreenindia.in\resources-section.html'
]

for file_path in files_to_update:
    content = open(file_path, encoding='utf-8').read()
    
    # We want to replace the div with class="prh-partner-grid" and its entire contents
    # Since regex can be tricky with nested divs, we'll extract it using string slicing
    
    start_tag = '<div class="prh-partner-grid">'
    start_idx = content.find(start_tag)
    
    if start_idx == -1:
        print(f"Grid not found in {file_path}")
        continue
        
    # Find the end of this div (it ends right before <!-- SECURITY INFORMATION BAR -->)
    end_tag = '<!-- SECURITY INFORMATION BAR -->'
    end_idx = content.find(end_tag, start_idx)
    
    if end_idx == -1:
        print(f"End tag not found in {file_path}")
        continue
        
    # The grid ends at `</div>\n\n    <!-- SECURITY INFORMATION BAR -->`
    # Let's find the closing div before the end_tag
    closing_div_idx = content.rfind('</div>', start_idx, end_idx)
    
    if closing_div_idx != -1:
        # Include the closing div
        full_replacement = content[:start_idx] + new_grid_html + "\n\n    " + content[end_idx:]
        open(file_path, 'w', encoding='utf-8').write(full_replacement)
        print(f"Updated {file_path}")
    else:
        print(f"Could not find closing div in {file_path}")

