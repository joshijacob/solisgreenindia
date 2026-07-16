import json
import sys

sys.stdout.reconfigure(encoding='utf-8')
log_file = r'C:\Users\91974\.gemini\antigravity-ide\brain\df752326-8f9f-42d3-8b1e-138207e9047b\.system_generated\logs\transcript_full.jsonl'
edits = []
with open(log_file, 'r', encoding='utf-8') as f:
    for line in f:
        data = json.loads(line)
        for tc in data.get('tool_calls', []):
            if tc.get('name') in ('replace_file_content', 'multi_replace_file_content'):
                args = tc.get('args', {})
                if args.get('TargetFile', '').endswith('.html'):
                    edits.append(tc)

for e in edits:
    args = e['args']
    file = args['TargetFile']
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if e['name'] == 'replace_file_content':
            content = content.replace(args['TargetContent'], args['ReplacementContent'])
        elif e['name'] == 'multi_replace_file_content':
            for chunk in args['ReplacementChunks']:
                content = content.replace(chunk['TargetContent'], chunk['ReplacementContent'])
        
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Applied edit to', file)
    except Exception as ex:
        print('Failed', file, ex)
