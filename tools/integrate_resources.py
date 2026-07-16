import sys

# 1. Update index.html
html_content = open(r'd:\Antigravity\solisgreenindia.in\index.html', encoding='utf-8').read()
res_html = open(r'd:\Antigravity\solisgreenindia.in\resources-section.html', encoding='utf-8').read()

# Extract everything from resources-section.html except the bottom CTA and closing tags
start_res = res_html.find('<section class="premium-resources-hub">')
end_res = res_html.find('<!-- BOTTOM CTA: RE-USED PREMIUM COMPONENT -->')
new_html_block = res_html[start_res:end_res] + "  </div>\n</section>\n\n  "

idx1 = html_content.find('<!-- ========== USEFUL LINKS ========== -->')
idx2 = html_content.find('<!-- ========== PREMIUM FINAL CALL TO ACTION ========== -->')

if idx1 != -1 and idx2 != -1:
    new_index = html_content[:idx1] + new_html_block + html_content[idx2:]
    open(r'd:\Antigravity\solisgreenindia.in\index.html', 'w', encoding='utf-8').write(new_index)
    print("Updated index.html")
else:
    print("Could not find replacement block in index.html")

# 2. Update style.css
css_content = open(r'd:\Antigravity\solisgreenindia.in\resources-section.css', encoding='utf-8').read()
style_content = open(r'd:\Antigravity\solisgreenindia.in\style.css', encoding='utf-8').read()

if 'PREMIUM RESOURCES HUB' not in style_content:
    open(r'd:\Antigravity\solisgreenindia.in\style.css', 'a', encoding='utf-8').write("\n" + css_content)
    print("Appended to style.css")
else:
    print("CSS already in style.css")
