#!/usr/bin/env python3
"""从 data/projects.yaml 读取仓库列表，调用 GitHub API 获取详细信息并写入 data/projects_meta.json"""

import os
import json
import urllib.request

def main():
    token = os.environ.get('GITHUB_TOKEN', '')
    headers = {'Accept': 'application/vnd.github.v3+json'}
    if token:
        headers['Authorization'] = f'Bearer {token}'

    # 解析 projects.yaml
    repos = []
    with open('data/projects.yaml') as f:
        for line in f:
            if line.strip().startswith('- repo:'):
                repo = line.split(':')[1].strip().strip('"').strip("'")
                if repo:
                    repos.append(repo)

    projects = []
    for repo in repos:
        url = f'https://api.github.com/repos/{repo}'
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())

        # Get README (base64 encoded)
        readme_url = f'https://api.github.com/repos/{repo}/readme'
        readme_content = ''
        try:
            req2 = urllib.request.Request(readme_url, headers=headers)
            with urllib.request.urlopen(req2, timeout=10) as resp2:
                readme_data = json.loads(resp2.read().decode())
                readme_content = readme_data.get('content', '')
        except Exception:
            pass

        projects.append({
            'repo': repo,
            'name': data.get('name', repo.split('/')[-1]),
            'description': data.get('description') or '',
            'language': data.get('language') or '',
            'stars': data.get('stargazers_count') or 0,
            'forks': data.get('forks_count') or 0,
            'license': data['license']['spdx_id'] if data.get('license') else '',
            'url': data.get('html_url', ''),
            'readme_content': readme_content,
        })

    os.makedirs('data', exist_ok=True)
    with open('data/projects_meta.json', 'w') as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)
    print(f'[projects] Fetched {len(projects)} projects: {[p["repo"] for p in projects]}')

if __name__ == '__main__':
    main()