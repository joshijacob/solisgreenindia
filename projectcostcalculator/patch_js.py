import os
import re

files_to_patch = ['js/app_v2.js', 'js/admin.js', 'js/bom_master.js', 'js/panel_master.js', 'js/inverter_master.js']

for f in files_to_patch:
    if not os.path.exists(f): continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Replace DOMContentLoaded handler to await Firebase sync
    content = re.sub(r"document\.addEventListener\('DOMContentLoaded',\s*\(\)\s*=>\s*\{", "document.addEventListener('DOMContentLoaded', async () => {\n    if (typeof syncFirebaseToLocal === 'function') await syncFirebaseToLocal();\n", content)
    
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
