"""Skip web checks only when every changed path is known to be documentation."""
import json
import os
from pathlib import Path
import re
import subprocess


DOCUMENTATION = {
    'README.md', 'CONTRIBUTING.md', 'RELEASING.md', 'SECURITY.md',
    'PROBLEM_CONTRACT.md', '.github/pull_request_template.md',
}


def documentation_only(path):
    return (
        path in DOCUMENTATION
        or path.startswith('.github/ISSUE_TEMPLATE/')
        or (path.startswith('docs/') and Path(path).suffix.lower()
            in {'.md', '.png', '.jpg', '.jpeg', '.webp', '.svg'})
    )


def needs_web_checks(event_name, event, cwd=None):
    if event_name == 'pull_request':
        pr = event.get('pull_request', {})
        before = pr.get('base', {}).get('sha', '')
        after = pr.get('head', {}).get('sha', '')
        separator = '...'
    elif event_name == 'push':
        before, after = event.get('before', ''), event.get('after', '')
        separator = '..'
    else:
        # Manual runs always exercise the full pipeline.
        return True
    if not all(re.fullmatch(r'[0-9a-f]{40}', sha) and set(sha) != {'0'}
               for sha in (before, after)):
        return True
    try:
        output = subprocess.check_output(
            ['git', 'diff', '--name-only', '--no-renames', '-z',
             f'{before}{separator}{after}', '--'], cwd=cwd, stderr=subprocess.PIPE,
        )
    except (OSError, subprocess.CalledProcessError):
        # Missing history must never turn into skipped validation.
        return True
    paths = output.decode('utf-8', errors='surrogateescape').split('\0')[:-1]
    return not paths or any(not documentation_only(path) for path in paths)


def main():
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    web = needs_web_checks(os.environ['GITHUB_EVENT_NAME'], event)
    with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
        output.write(f'web={str(web).lower()}\n')
    print('Running all web checks.' if web else
          'Documentation-only change: formatting only; no web build or deployment.')


if __name__ == '__main__':
    main()
