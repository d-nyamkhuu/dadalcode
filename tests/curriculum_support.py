"""Shared helpers for independent curriculum, boundary, and judge regressions."""
import copy
import importlib.util
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROBLEMS = ROOT / 'public' / 'problems'
spec = importlib.util.spec_from_file_location('curriculum_harness', ROOT / 'src/runtime/harness.py')
harness = importlib.util.module_from_spec(spec)
spec.loader.exec_module(harness)


def read_solution(slug):
    return (PROBLEMS / slug / 'solution.py').read_text()


def run_problem(slug, input, expected, code=None):
    """Return the inner result dict; callers assert passed/actual/error."""
    adapter = (PROBLEMS / slug / 'adapter.py').read_text()
    return harness.run_case(
        read_solution(slug) if code is None else code,
        adapter,
        {'name': 'Curriculum regression', 'input': input, 'expected': expected},
    )['result']


def check_output(slug, actual, expected, input):
    """Exercise a custom output checker without running a candidate solution."""
    namespace = harness.base_namespace()
    exec(compile((PROBLEMS / slug / 'adapter.py').read_text(), '<adapter>', 'exec'), namespace)
    if 'check' in namespace:
        return bool(namespace['check'](copy.deepcopy(actual), copy.deepcopy(expected), copy.deepcopy(input)))
    return harness.equivalent(actual, expected)
