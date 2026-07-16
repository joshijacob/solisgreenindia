import os
import re
from pathlib import Path

def fix_remaining(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    original = content
    
    # 1. Fix missing favicons by pointing to favicon.ico
    content = content.replace('href="/favicon/apple-touch-icon.png"', 'href="/favicon/favicon.ico"')
    content = content.replace('href="/favicon/favicon-16x16.png"', 'href="/favicon/favicon-16x16.ico"')
    content = content.replace('href="/favicon/favicon-32x32.png"', 'href="/favicon/favicon-32x32.ico"')
    content = content.replace('href="/favicon/site.webmanifest"', '')
    content = content.replace('href="/favicon/safari-pinned-tab.svg"', '')

    # 2. Fix weird script/style names
    content = re.sub(r'href="/[a-z]+-styles\.css"', 'href="/style.css"', content)
    content = re.sub(r'src="/[a-z]+-scripts\.js"', 'src="/script.js?v=5"', content)

    # 3. Fix /services.html#commercial -> /services/#commercial
    content = content.replace('href="/services.html', 'href="/services/')

    # 4. Fix missing images that were already absolute
    content = content.replace('/images/about/hero-image-2.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/about/story-image.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/about/team-installation.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/about/team-support.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/about/team-technical.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/service-areas/hero-areas.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/hero/hero-contact-1.webp', '/images/hero/hero-image-2.webp')
    content = content.replace('/images/hero/projects-hero.webp', '/images/hero/hero-image-2.webp')

    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

def main():
    root_dir = r"d:\Antigravity\solisgreenindia.in"
    for f in Path(root_dir).rglob("*.html"):
        fix_remaining(f)
    print("Fixed remaining links.")

if __name__ == "__main__":
    main()
