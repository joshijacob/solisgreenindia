import os
import re

directory = r"d:\Antigravity\solisgreenindia.in"

# Regex to match the solis-header and its entire content
# Using DOTALL so that '.' matches newlines
header_pattern = re.compile(r'<header class="solis-header">.*?</header>', re.DOTALL | re.IGNORECASE)
fallback_pattern = re.compile(r'<header[^>]*>.*?</header>', re.DOTALL | re.IGNORECASE)

new_header_tag = '<div id="header-placeholder"></div>'

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.html') and file != 'header.html' and file != 'footer.html':
            filepath = os.path.join(root, file)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                continue
            
            # Replace the header tag
            new_content, num_subs = header_pattern.subn(new_header_tag, content)
            
            # If not found, try the fallback pattern
            if num_subs == 0:
                new_content, num_subs = fallback_pattern.subn(new_header_tag, content)
                
            if num_subs > 0:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f"Updated header tags in {count} HTML files.")
