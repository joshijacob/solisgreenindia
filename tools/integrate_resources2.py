import sys

html_content = open(r'd:\Antigravity\solisgreenindia.in\index.html', encoding='utf-8').read()
res_html = open(r'd:\Antigravity\solisgreenindia.in\resources-section.html', encoding='utf-8').read()

start_res = res_html.find('<section class="premium-resources-hub">')
# the new resources-section.html does not have a bottom CTA anymore! It's just a closing </section>
# Wait, I DO have a security information bar, and then the file ends with </div></section>!
# So I can just take everything from start_res to the end of the file.
new_html_block = res_html[start_res:] + "\n  "

idx1 = html_content.find('<section class="premium-resources-hub">')
idx2 = html_content.find('<!-- ========== PREMIUM FINAL CALL TO ACTION ========== -->')

if idx1 != -1 and idx2 != -1:
    new_index = html_content[:idx1] + new_html_block + html_content[idx2:]
    open(r'd:\Antigravity\solisgreenindia.in\index.html', 'w', encoding='utf-8').write(new_index)
    print("Updated index.html")
else:
    print(f"Could not find replacement block in index.html. idx1={idx1}, idx2={idx2}")

css_content = open(r'd:\Antigravity\solisgreenindia.in\resources-section.css', encoding='utf-8').read()
style_content = open(r'd:\Antigravity\solisgreenindia.in\style.css', encoding='utf-8').read()

# Since I appended CSS earlier, I need to replace it.
# Let's find the start of the old CSS I injected: "/* =========================================================================\n   PREMIUM RESOURCES HUB (SaaS Style)\n"
start_css = style_content.find("/* =========================================================================\n   PREMIUM RESOURCES HUB")
if start_css != -1:
    style_content = style_content[:start_css] + css_content
    open(r'd:\Antigravity\solisgreenindia.in\style.css', 'w', encoding='utf-8').write(style_content)
    print("Replaced CSS in style.css")
else:
    open(r'd:\Antigravity\solisgreenindia.in\style.css', 'a', encoding='utf-8').write("\n" + css_content)
    print("Appended CSS to style.css")
