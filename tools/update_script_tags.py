import os
import re

directory = r"d:\Antigravity\solisgreenindia.in"

# Regex to match any script tag pointing to script.js (with or without relative paths, v parameters, defer)
script_pattern = re.compile(r'<script\s+src="[^"]*script\.js[^"]*"(?:\s+defer)?>\s*</script>', re.IGNORECASE)

# Standardized script tag
new_script_tag = '<script src="/script.js?v=4" defer></script>'

count = 0
for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace the script tag
            new_content = script_pattern.sub(new_script_tag, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                count += 1

print(f"Updated script tags in {count} HTML files.")
