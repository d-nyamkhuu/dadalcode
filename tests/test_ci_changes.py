"""Keep documentation skips from hiding app changes or missing Git history."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('ci_changes', ROOT / 'scripts/ci_changes.py')
ci = importlib.util.module_from_spec(spec)
spec.loader.exec_module(ci)


class CIChanges(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.root = Path(self.directory.name)
        self.git('init', '-q')
        self.git('symbolic-ref', 'HEAD', 'refs/heads/main')
        self.git('config', 'user.name', 'CI test')
        self.git('config', 'user.email', 'ci@example.invalid')
        self.write('README.md', 'Original docs')
        self.write('src/app.js', 'Original app')
        self.base = self.commit()

    def git(self, *args):
        return subprocess.check_output(['git', *args], cwd=self.root, text=True).strip()

    def write(self, path, content):
        target = self.root / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content)

    def commit(self):
        self.git('add', '.')
        self.git('commit', '-qm', 'Test change')
        return self.git('rev-parse', 'HEAD')

    def pr(self, head, base=None):
        return {'pull_request': {'base': {'sha': base or self.base}, 'head': {'sha': head}}}

    def test_docs_and_screenshots_skip_for_pr_and_push(self):
        self.write('README.md', 'New screenshot links')
        self.write('docs/screenshots/study plan.png', 'Image fixture')
        head = self.commit()
        self.assertFalse(ci.needs_web_checks('pull_request', self.pr(head), self.root))
        self.assertFalse(ci.needs_web_checks('push', {'before': self.base, 'after': head}, self.root))

    def test_all_pr_commits_are_checked_not_only_the_last(self):
        self.write('src/app.js', 'App change')
        self.commit()
        self.write('README.md', 'Docs after code change')
        head = self.commit()
        self.assertTrue(ci.needs_web_checks('pull_request', self.pr(head), self.root))

    def test_rename_into_docs_still_checks_deleted_source(self):
        target = self.root / 'docs/old-app.md'
        target.parent.mkdir()
        (self.root / 'src/app.js').rename(target)
        self.assertTrue(ci.needs_web_checks('pull_request', self.pr(self.commit()), self.root))

    def test_pr_uses_merge_base_when_main_advances(self):
        self.git('checkout', '-qb', 'docs')
        self.write('README.md', 'Docs branch')
        head = self.commit()
        self.git('checkout', '-q', 'main')
        self.write('src/app.js', 'Already on main')
        new_base = self.commit()
        self.assertFalse(ci.needs_web_checks('pull_request', self.pr(head, new_base), self.root))

    def test_bundled_notices_and_unknown_paths_are_never_docs_only(self):
        for path in ['LICENSE', 'THIRD_PARTY_NOTICES.md', 'licenses/README.md',
                     'public/credits.html', 'public/problems/two-sum/lesson.json',
                     'package-lock.json', '.github/workflows/pages.yml',
                     'scripts/ci_changes.py', 'tests/test_ci_changes.py',
                     'new-build-config.json', 'docs/build.mjs']:
            with self.subTest(path=path):
                self.assertFalse(ci.documentation_only(path))

    def test_manual_empty_and_missing_history_run_full_checks(self):
        self.assertTrue(ci.needs_web_checks('workflow_dispatch', {}, self.root))
        self.assertTrue(ci.needs_web_checks('push', {}, self.root))
        self.assertTrue(ci.needs_web_checks('push', {'before': '0' * 40, 'after': self.base}, self.root))
        self.assertTrue(ci.needs_web_checks('push', {'before': self.base, 'after': self.base}, self.root))
        self.assertTrue(ci.needs_web_checks('pull_request', self.pr('f' * 40), self.root))

    def test_cli_emits_boolean_job_output(self):
        self.write('README.md', 'Docs only')
        event = self.pr(self.commit())
        event_path, output_path = self.root / 'event.json', self.root / 'output'
        event_path.write_text(json.dumps(event))
        subprocess.run([sys.executable, str(ROOT / 'scripts/ci_changes.py')],
                       cwd=self.root, check=True, capture_output=True,
                       env={**os.environ, 'GITHUB_EVENT_NAME': 'pull_request',
                            'GITHUB_EVENT_PATH': str(event_path),
                            'GITHUB_OUTPUT': str(output_path)})
        self.assertEqual(output_path.read_text(), 'web=false\n')


if __name__ == '__main__':
    unittest.main()
