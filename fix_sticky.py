import re

# 1. Update footer.html
with open('footer.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace mobile CTA classes
html = html.replace('class="mobile-sticky-cta"', 'class="sticky-contact-bar"')
html = html.replace('class="mobile-cta-btn call"', 'class="sticky-call"')
html = html.replace('class="mobile-cta-btn whatsapp"', 'class="sticky-whatsapp"')
html = html.replace('class="mobile-cta-btn quote"', 'class="sticky-quote"')

with open('footer.html', 'w', encoding='utf-8') as f:
    f.write(html)

# 2. Update style.css
with open('style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Remove the garbage Javascript block from style.css
# It starts at: /* =========================================================
#    SOLIS GREEN INDIA - UNIFIED MOBILE MENU SYSTEM
js_regex = re.compile(r'/\* =========================================================\n\s*SOLIS GREEN INDIA - UNIFIED MOBILE MENU SYSTEM.*?module\.exports = MobileMenuSystem;\n}', re.MULTILINE | re.DOTALL)
css = js_regex.sub('', css)

# Add .sticky-quote color if missing
if '.sticky-quote' not in css:
    css = css.replace('.sticky-whatsapp {\n  background: #25D366;\n}', '.sticky-whatsapp {\n  background: #25D366;\n}\n\n.sticky-quote {\n  background: #2980b9;\n}')

with open('style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Updated footer.html and cleaned style.css")
