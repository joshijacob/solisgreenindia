import os
import re

firebase_sdk = """
    <!-- Firebase SDKs -->
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js"></script>
    <script src="js/firebase-init.js"></script>
"""

for file_name in os.listdir('.'):
    if file_name.endswith('.html'):
        with open(file_name, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Clean up bottom injects
        content = re.sub(r'\s*<!-- Firebase Compat SDKs -->.*?firebase-auth-compat\.js"></script>', '', content, flags=re.DOTALL)
        
        # Inject at the top before auth.js
        if '<!-- Firebase SDKs -->' not in content:
            content = re.sub(r'(\s*<script src="js/auth\.js"></script>)', firebase_sdk + r'\1', content)
            
        with open(file_name, 'w', encoding='utf-8') as f:
            f.write(content)
