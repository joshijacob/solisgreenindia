import os
import re
import urllib.parse
from pathlib import Path

def main():
    root_dir = r"d:\Antigravity\solisgreenindia.in"
    html_files = list(Path(root_dir).rglob("*.html"))
    
    # 1. Check for empty HTML files
    print("=== Checking for empty or near-empty HTML files ===")
    empty_files = []
    for f in html_files:
        try:
            if f.stat().st_size < 50:  # less than 50 bytes is practically empty
                empty_files.append(f)
                print(f"[EMPTY/SMALL FILE] {f.relative_to(root_dir)} ({f.stat().st_size} bytes)")
        except Exception as e:
            print(f"Error reading {f}: {e}")
            
    print(f"\nFound {len(empty_files)} empty or extremely small HTML files.\n")

    # 2. Check for broken internal links and localhost links
    print("=== Checking for broken internal links ===")
    
    href_regex = re.compile(r'(?:href|src)="([^"]+)"')
    
    broken_links = []
    localhost_links = []
    
    for f in html_files:
        try:
            with open(f, 'r', encoding='utf-8') as file:
                content = file.read()
                
            links = href_regex.findall(content)
            for link in links:
                # Check for localhost
                if "localhost" in link:
                    localhost_links.append((f.relative_to(root_dir), link))
                    continue
                    
                # Skip external links
                if link.startswith("http://") or link.startswith("https://") or link.startswith("tel:") or link.startswith("mailto:") or link.startswith("#"):
                    continue
                    
                # Handle root relative links
                if link.startswith("/"):
                    # e.g., /about/ -> d:\Antigravity\solisgreenindia.in\about
                    # Strip query params and hashes
                    clean_link = urllib.parse.urlparse(link).path
                    
                    target_path = Path(root_dir) / clean_link.lstrip("/")
                else:
                    # Handle relative links
                    clean_link = urllib.parse.urlparse(link).path
                    target_path = f.parent / clean_link
                    
                # If it's a directory, typically it serves index.html
                if not target_path.exists():
                    broken_links.append((f.relative_to(root_dir), link))
                elif target_path.is_dir():
                    # check if index.html exists in that dir
                    if not (target_path / "index.html").exists() and not (target_path / "contact.html").exists():
                         broken_links.append((f.relative_to(root_dir), link))
                         
        except Exception as e:
            pass # ignore parse errors for now

    if localhost_links:
        print("\n=== Localhost links found ===")
        for file, link in set(localhost_links):
            print(f"[{file}] -> {link}")
            
    if broken_links:
        print(f"\n=== Broken Links Found ({len(set(broken_links))}) ===")
        for file, link in sorted(set(broken_links)):
            print(f"[{file}] -> {link}")
    else:
        print("\nNo broken internal links found!")

if __name__ == "__main__":
    main()
