import os
import datetime

base_dir = r'd:\Antigravity\solisgreenindia.in'
sitemap_paths = [
    r'd:\Antigravity\solisgreenindia.in\sitemap.xml',
    r'd:\Antigravity\github_repo\sitemap.xml'
]

urls = []

for dirpath, dirnames, filenames in os.walk(base_dir):
    if 'node_modules' in dirpath or '.git' in dirpath:
        continue
    if 'index.html' in filenames:
        rel_path = os.path.relpath(dirpath, base_dir).replace('\\', '/')
        if rel_path == '.':
            url = 'https://www.solisgreenindia.in/'
            priority = '1.0'
        else:
            url = f'https://www.solisgreenindia.in/{rel_path}/'
            priority = '0.8'
        
        urls.append((url, priority))

# sort urls alphabetically
urls.sort(key=lambda x: x[0])

xml_content = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
today = datetime.datetime.now().strftime('%Y-%m-%d')

for url, priority in urls:
    xml_content.append('  <url>')
    xml_content.append(f'    <loc>{url}</loc>')
    xml_content.append(f'    <lastmod>{today}</lastmod>')
    xml_content.append('    <changefreq>weekly</changefreq>')
    xml_content.append(f'    <priority>{priority}</priority>')
    xml_content.append('  </url>')

xml_content.append('</urlset>')

final_xml = '\n'.join(xml_content)

for path in sitemap_paths:
    with open(path, 'w', encoding='utf-8') as f:
        f.write(final_xml)

print(f'Generated sitemap with {len(urls)} URLs.')
