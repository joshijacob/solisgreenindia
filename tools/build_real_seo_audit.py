import os
import re
import json

base_dir = r'd:\Antigravity\solisgreenindia.in'
output_json = os.path.join(base_dir, 'seo', 'seo_audit_data.json')

audit_results = []

for dirpath, dirnames, filenames in os.walk(base_dir):
    # Exclude internal / non-public dirs
    if any(p in dirpath for p in ['.git', '.vercel', 'node_modules', 'projectcostcalculator', 'Login', 'analytics', 'seo', 'tools']):
        continue

    for filename in filenames:
        if filename.endswith('.html'):
            filepath = os.path.join(dirpath, filename)
            rel_dir = os.path.relpath(dirpath, base_dir).replace('\\', '/')
            
            if rel_dir == '.' and filename == 'index.html':
                url_path = '/'
            elif filename == 'index.html':
                url_path = f'/{rel_dir}/'
            elif rel_dir == '.':
                url_path = f'/{filename}'
            else:
                url_path = f'/{rel_dir}/{filename}'

            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    html = f.read()
            except Exception as e:
                continue

            # 1. Title
            title_match = re.search(r'<title[^>]*>(.*?)</title>', html, re.IGNORECASE | re.DOTALL)
            title = re.sub(r'\s+', ' ', title_match.group(1)).strip() if title_match else ''

            # 2. Meta Description
            desc_match = re.search(r'<meta[^>]*name=[\'"]description[\'"][^>]*content=[\'"]([^\'"]*)[\'"]', html, re.IGNORECASE)
            if not desc_match:
                desc_match = re.search(r'<meta[^>]*content=[\'"]([^\'"]*)[\'"][^>]*name=[\'"]description[\'"]', html, re.IGNORECASE)
            desc = re.sub(r'\s+', ' ', desc_match.group(1)).strip() if desc_match else ''

            # 3. H1 Heading
            h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.IGNORECASE | re.DOTALL)
            h1 = re.sub(r'<[^>]+>', '', h1_match.group(1)).strip() if h1_match else ''
            h1 = re.sub(r'\s+', ' ', h1)

            # 4. Canonical
            canon_match = re.search(r'<link[^>]*rel=[\'"]canonical[\'"][^>]*href=[\'"]([^\'"]*)[\'"]', html, re.IGNORECASE)
            canonical = canon_match.group(1).strip() if canon_match else ''

            # 5. OpenGraph Tags
            og_title = bool(re.search(r'<meta[^>]*property=[\'"]og:title[\'"]', html, re.IGNORECASE))
            og_image = bool(re.search(r'<meta[^>]*property=[\'"]og:image[\'"]', html, re.IGNORECASE))

            # 6. Schema (JSON-LD)
            schemas = re.findall(r'<script[^>]*type=[\'"]application/ld\+json[\'"][^>]*>(.*?)</script>', html, re.IGNORECASE | re.DOTALL)
            schema_types = []
            for sc in schemas:
                types = re.findall(r'[\'"]@type[\'"]\s*:\s*[\'"]([^\'"]+)[\'"]', sc)
                schema_types.extend(types)

            # 7. Images & Alt attributes
            img_tags = re.findall(r'<img[^>]*>', html, re.IGNORECASE)
            total_images = len(img_tags)
            images_with_alt = sum(1 for img in img_tags if re.search(r'alt=[\'"][^\'"]+[\'"]', img, re.IGNORECASE))

            # 8. Word Count
            text_only = re.sub(r'<script[^>]*>.*?</script>', ' ', html, flags=re.DOTALL | re.IGNORECASE)
            text_only = re.sub(r'<style[^>]*>.*?</style>', ' ', text_only, flags=re.DOTALL | re.IGNORECASE)
            text_only = re.sub(r'<[^>]+>', ' ', text_only)
            words = [w for w in text_only.split() if len(w) > 1]
            word_count = len(words)

            # 9. Issues Detection & Health Score
            issues = []
            score = 100

            if not title:
                issues.append("Missing <title> tag")
                score -= 30
            elif len(title) < 25:
                issues.append(f"Title is too short ({len(title)} chars, min 30)")
                score -= 10
            elif len(title) > 65:
                issues.append(f"Title exceeds Google limit ({len(title)} chars, max 60)")
                score -= 10

            if not desc:
                issues.append("Missing meta description")
                score -= 25
            elif len(desc) < 70:
                issues.append(f"Meta description too short ({len(desc)} chars, recommended 120-160)")
                score -= 10
            elif len(desc) > 170:
                issues.append(f"Meta description too long ({len(desc)} chars, max 160)")
                score -= 5

            if not h1:
                issues.append("Missing <h1> heading tag")
                score -= 15

            if not canonical:
                issues.append("Missing canonical link tag")
                score -= 10

            if not og_title or not og_image:
                issues.append("Incomplete OpenGraph tags for WhatsApp/Facebook sharing")
                score -= 10

            if not schemas:
                issues.append("No JSON-LD structured data schema detected")
                score -= 10

            missing_alt = total_images - images_with_alt
            if missing_alt > 0:
                issues.append(f"{missing_alt} image(s) missing alt text")
                score -= min(15, missing_alt * 3)

            score = max(20, min(100, score))

            # Grade
            if score >= 90:
                grade = 'A+'
            elif score >= 80:
                grade = 'A'
            elif score >= 70:
                grade = 'B'
            elif score >= 60:
                grade = 'C'
            else:
                grade = 'Needs Work'

            # Categorize URL
            if 'kottayam' in url_path or 'thiruvalla' in url_path or 'kollam' in url_path or 'pathanamthitta' in url_path or 'alappuzha' in url_path or 'thiruvananthapuram' in url_path:
                category = 'districts'
            elif '3kw' in url_path or '5kw' in url_path or 'price' in url_path or 'cost' in url_path or 'subsidy' in url_path:
                category = 'pricing'
            else:
                category = 'core'

            audit_results.append({
                'url': url_path,
                'fullUrl': f'https://www.solisgreenindia.in{url_path}',
                'title': title,
                'titleLength': len(title),
                'desc': desc,
                'descLength': len(desc),
                'h1': h1,
                'canonical': canonical,
                'hasOg': og_title and og_image,
                'hasSchema': len(schemas) > 0,
                'schemaTypes': list(set(schema_types)),
                'imagesTotal': total_images,
                'imagesWithAlt': images_with_alt,
                'missingAlt': missing_alt,
                'wordCount': word_count,
                'issues': issues,
                'score': score,
                'grade': grade,
                'category': category
            })

# Sort by score ascending (pages with issues first), then by URL
audit_results.sort(key=lambda x: (x['score'], x['url']))

# Summary stats
total_pages = len(audit_results)
avg_score = round(sum(p['score'] for p in audit_results) / total_pages) if total_pages else 0
pages_with_issues = sum(1 for p in audit_results if len(p['issues']) > 0)
optimal_pages = sum(1 for p in audit_results if p['score'] >= 90)

output_data = {
    'generatedAt': '2026-10-27T06:28:00Z',
    'summary': {
        'totalPagesScanned': total_pages,
        'averageHealthScore': avg_score,
        'optimalPages': optimal_pages,
        'pagesWithIssues': pages_with_issues
    },
    'pages': audit_results
}

os.makedirs(os.path.dirname(output_json), exist_ok=True)
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2, ensure_ascii=False)

print(f"Real SEO audit complete! Scanned {total_pages} live HTML pages. Average score: {avg_score}%. Saved to {output_json}")
