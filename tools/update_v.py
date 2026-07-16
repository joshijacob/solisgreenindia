import os, re
d=r'd:\Antigravity\solisgreenindia.in'
c=0
files_to_update = [os.path.join(r,f) for r,d_dirs,files in os.walk(d) for f in files if f.endswith('.html')]
for f in files_to_update:
  with open(f, 'r', encoding='utf-8') as file_obj:
    content = file_obj.read()
  new_content = re.sub(r'script\.js(\?v=\d+)?', 'script.js?v=5', content)
  if content != new_content:
    with open(f, 'w', encoding='utf-8') as file_obj:
      file_obj.write(new_content)
    c += 1
print(f'Updated cache buster in {c} files.')
