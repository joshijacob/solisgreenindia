import os
import re

d = r'd:\Antigravity\solisgreenindia.in'

# 1. Read index.html
index_path = os.path.join(d, 'index.html')
index_content = open(index_path, encoding='utf-8').read()

# 2. Extract the premium resources hub
start_idx = index_content.find('<section class="premium-resources-hub">')
end_idx = index_content.find('</section>', start_res) + 10 if 'start_res' in locals() else index_content.find('</section>', start_idx) + 10
# Wait, I need to make sure I get the end correctly. The section closes just before the final CTA.
end_idx = index_content.find('<!-- ========== PREMIUM FINAL CALL TO ACTION ========== -->')

if start_idx == -1 or end_idx == -1:
    print("Could not find premium resources hub in index.html")
    sys.exit(1)

resources_html = index_content[start_idx:end_idx].strip()

# 3. Create the replacement CTA banner for index.html
cta_banner = """
  <!-- ========== USEFUL RESOURCES CTA ========== -->
  <section class="section-light" style="padding: 60px 0; background-color: #f7f9fc;">
    <div class="container" style="text-align: center; max-width: 800px; margin: 0 auto;">
      <h2 style="font-size: 2rem; color: #111827; margin-bottom: 15px; font-weight: 800;">Planning your solar project?</h2>
      <p style="font-size: 1.1rem; color: #4b5563; margin-bottom: 30px;">Explore our free Solar Calculators, EMI Estimators, and official KSEB & Government Guidelines.</p>
      <a href="/useful-resources/" class="btn btn-primary" style="font-size: 1rem; padding: 12px 24px;">Explore Useful Resources <i class="fas fa-arrow-right" style="margin-left: 8px;"></i></a>
    </div>
  </section>

"""

new_index_content = index_content[:start_idx] + cta_banner + "\n  " + index_content[end_idx:]
open(index_path, 'w', encoding='utf-8').write(new_index_content)
print("Updated index.html")

# 4. Create useful-resources/index.html
os.makedirs(os.path.join(d, 'useful-resources'), exist_ok=True)
resources_page_path = os.path.join(d, 'useful-resources', 'index.html')

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
    <link rel="stylesheet" href="/style.css?v=4">
</head>
<body>

    <!-- ========== HEADER ========== -->
    <div id="header-placeholder"></div>

    <!-- ========== MAIN CONTENT ========== -->
    <main>
{resources_html}
    </main>

    <!-- ========== FOOTER ========== -->
    <div id="footer-placeholder"></div>

    <!-- JavaScript -->
    <script src="/script.js?v=4" defer></script>
</body>
</html>
"""

open(resources_page_path, 'w', encoding='utf-8').write(page_content)
print("Created useful-resources/index.html")

# 5. Update sitemap.xml
sitemap_path = os.path.join(d, 'sitemap.xml')
sitemap_content = open(sitemap_path, encoding='utf-8').read()

if '<loc>https://www.solisgreenindia.in/useful-resources/</loc>' not in sitemap_content:
    # Insert before closing urlset
    new_url = '''
  <url>
    <loc>https://www.solisgreenindia.in/useful-resources/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>'''
    sitemap_content = sitemap_content.replace('</urlset>', new_url)
    open(sitemap_path, 'w', encoding='utf-8').write(sitemap_content)
    print("Updated sitemap.xml")

