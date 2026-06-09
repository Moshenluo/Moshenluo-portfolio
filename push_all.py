import requests, base64, json, os

TOKEN = os.environ.get('GITHUB_TOKEN', '')
REPO = 'Moshenluo/Moshenluo-portfolio'
HEADERS = {'Authorization': f'token {TOKEN}', 'Accept': 'application/vnd.github.v3+json'}

def get_sha(path):
    r = requests.get(f'https://api.github.com/repos/{REPO}/contents/{path}', headers=HEADERS)
    return r.json().get('sha') if r.status_code == 200 else None

def push_file(path, local_path, msg):
    with open(local_path, 'rb') as f:
        content = base64.b64encode(f.read()).decode()
    sha = get_sha(path)
    data = {'message': msg, 'content': content, 'branch': 'main'}
    if sha:
        data['sha'] = sha
    r = requests.put(f'https://api.github.com/repos/{REPO}/contents/{path}', headers=HEADERS, data=json.dumps(data))
    ok = '[OK]' if r.status_code in [200, 201] else f'[FAIL] {r.status_code}'
    print(f'{ok} {path}')

push_file('index.html', 'portfolio_current.html', 'v5.1: smoother intro — particles converge to name → scatter → reform CRT frame → CRT appears naturally')
push_file('css/style.css', 'portfolio_style_new.css', 'v5.1: CRT frame initial opacity 0 with fade-in on particle converge')
push_file('js/script.js', 'portfolio_script_new.js', 'v5.1: 5-phase particle animation: converge_name → hold → scatter → converge_crt → hold, CRT naturally emerges from particles')
print('All done!')
