import os
import re
from pathlib import Path

def fix_links(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # 1. Replace relative paths to root assets like ../../style.css -> /style.css
    # We look for href="../../something" or src="../something"
    def replacer(match):
        attr = match.group(1) # href or src
        path = match.group(2) # the part after the ../ sequence
        
        # specific fixes for .html links that should point to directories
        if path.endswith('.html') and path not in ['index.html']:
            # e.g. contact.html -> contact/
            folder_name = path.replace('.html', '/')
            # check if it's a known folder
            if folder_name.strip('/') in ['contact', 'projects', 'services', 'about']:
                path = folder_name
                
        # Fix missing images (fallback)
        if "hero-about.webp" in path: path = path.replace("hero-about.webp", "hero-image-2.webp")
        if "chadayamangalam-solar.webp" in path: path = path.replace("chadayamangalam-solar.webp", "hero-image-2.webp")
        if "paravur-hero.webp" in path: path = path.replace("paravur-hero.webp", "hero-image-2.webp")
        if "punalur-hero.webp" in path: path = path.replace("punalur-hero.webp", "hero-image-2.webp")

        # Fix favicon ext
        if "favicon-16x16.png" in path: path = path.replace("favicon-16x16.png", "favicon-16x16.ico")
        if "favicon-32x32.png" in path: path = path.replace("favicon-32x32.png", "favicon-32x32.ico")
        if "apple-touch-icon.png" in path: path = path.replace("apple-touch-icon.png", "favicon.ico")
            
        # Also clean up trailing query params for script tags if they are duplicated or something, though it's fine.
        return f'{attr}="/{path}"'

    content = re.sub(r'(href|src)="(?:(?:\.\./)+)([^"]+)"', replacer, content)

    # 2. Fix some specific cases that didn't use ../ but were just broken absolute links
    content = content.replace('href="/solar-company-in-kottayam/mundakayam/"', 'href="/solar-company-in-kottayam/"')
    content = content.replace('href="/solar-company-in-kollam/anchuthengu/"', 'href="/solar-company-in-kollam/"')
    content = content.replace('href="/solar-company-in-kollam/kappil/"', 'href="/solar-company-in-kollam/"')
    content = content.replace('href="/solar-company-in-kollam/paravur-town/"', 'href="/solar-company-in-kollam/paravur/"')
    content = content.replace('href="/solar-company-in-kollam/poovar/"', 'href="/solar-company-in-kollam/"')
    content = content.replace('href="/solar-company-in-kollam/puthenthope/"', 'href="/solar-company-in-kollam/"')
    content = content.replace('href="/solar-company-in-kollam/thekkumbhagom/"', 'href="/solar-company-in-kollam/"')
    
    # 3. Fix missing images that were already absolute
    content = content.replace('/images/hero/paravur-hero.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/hero/punalur-hero.webp', '/images/hero/hero-image-2.webp')

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    root_dir = r"d:\Antigravity\solisgreenindia.in"
    html_files = list(Path(root_dir).rglob("*.html"))
    count = 0
    for f in html_files:
        try:
            if fix_links(f):
                count += 1
        except Exception as e:
            print(f"Error processing {f}: {e}")
            
    print(f"Fixed links in {count} files.")
    
    # Write placeholders to empty files
    empty_files = [
        "3kw-vs-5kw-solar-system-kerala/index.html",
        "privacy-policy/index.html",
        "solar-company-in-kottayam/pala.html",
        "solar-company-in-pathanamthitta/chengannur.html"
    ]
    
    placeholder = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solis Green Energy Solutions</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <div id="header-placeholder"></div>
    <div class="container" style="padding: 150px 0; text-align: center; min-height: 50vh;">
        <h1>Content Coming Soon</h1>
        <p>This page is currently being updated. Please check back later.</p>
        <a href="/" class="btn btn-primary mt-3">Return Home</a>
    </div>
    <div id="footer-placeholder"></div>
    <script src="/script.js?v=5"></script>
</body>
</html>"""

    for rel_path in empty_files:
        full_path = Path(root_dir) / rel_path
        if full_path.exists() and full_path.stat().st_size < 50:
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(placeholder)
            print(f"Wrote placeholder to {rel_path}")

if __name__ == "__main__":
    main()
