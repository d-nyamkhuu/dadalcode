"""Executable authoring contracts, independent of any candidate solution.

Problem-specific semantic rules remain in statements and adapters. These checks
validate the shared JSON shape, signatures, and fixture invariants without
mistaking observed example values for the full allowed input domain.
"""
import ast
import hashlib
import json
import math
from pathlib import Path

PACKAGE_FILES = ('lesson.json', 'explanation.json', 'solution.py', 'starter.py', 'tests.json', 'adapter.py')


def text(value, label):
    assert isinstance(value, str) and value.strip(), f'{label} must be a nonempty string'


def string_list(value, label, allow_empty=False):
    assert isinstance(value, list) and (value or allow_empty), f'{label} must be a list of strings'
    for item in value:
        text(item, label)


def json_value(value):
    """Forbid nonfinite numbers and non-JSON values in authored fixtures."""
    if value is None or type(value) in (bool, int, str):
        return
    if type(value) is float:
        assert math.isfinite(value), 'Fixture numbers must be finite'
        return
    if isinstance(value, list):
        for item in value:
            json_value(item)
        return
    assert isinstance(value, dict), 'Fixture values must be JSON values'
    for key, item in value.items():
        assert isinstance(key, str), 'Fixture object keys must be strings'
        json_value(item)


def public_signatures(source):
    def signature(node):
        args = node.args
        return (
            tuple(a.arg for a in args.posonlyargs),
            tuple(a.arg for a in args.args),
            args.vararg.arg if args.vararg else None,
            tuple(a.arg for a in args.kwonlyargs),
            args.kwarg.arg if args.kwarg else None,
            tuple(ast.dump(default) for default in args.defaults),
            tuple(ast.dump(default) if default is not None else None for default in args.kw_defaults),
        )
    result = {}
    for node in ast.parse(source).body:
        if isinstance(node, ast.ClassDef) and not node.name.startswith('_'):
            for method in node.body:
                if isinstance(method, (ast.FunctionDef, ast.AsyncFunctionDef)) and (
                    not method.name.startswith('_') or method.name == '__init__'
                ):
                    result[f'{node.name}.{method.name}'] = signature(method)
        elif isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and not node.name.startswith('_'):
            result[node.name] = signature(node)
    return result


def validate_package(lesson, tests, solution, starter, adapter):
    assert isinstance(lesson, dict), 'Lesson must be an object'
    for key in ('slug', 'headline', 'statement', 'intuition', 'correctness', 'bruteForce'):
        text(lesson.get(key), key)
    for key in ('prerequisites', 'constraints', 'approach', 'pitfalls'):
        string_list(lesson.get(key), key)
    assert isinstance(lesson.get('complexity'), dict), 'Complexity must be an object'
    for key in ('time', 'space', 'explanation'):
        text(lesson['complexity'].get(key), f'complexity.{key}')
    sources = lesson.get('sources')
    assert isinstance(sources, list) and sources, 'Sources must be a nonempty list'
    for source in sources:
        assert isinstance(source, dict), 'Each source must be an object'
        text(source.get('label'), 'source.label')
        text(source.get('url'), 'source.url')
        assert source['url'].startswith('https://'), 'Source URLs must use HTTPS'
    visual = lesson.get('visualization')
    assert isinstance(visual, dict), 'Visualization must be an object'
    assert visual.get('kind') in {
        'array', 'linked-list', 'tree', 'graph', 'grid', 'dp', 'stack', 'heap',
        'intervals', 'backtracking', 'bits', 'trie',
    }, 'Unknown visualization kind'
    for key in ('focus', 'pointers', 'watch'):
        string_list(visual.get(key), f'visualization.{key}', allow_empty=True)
    assert isinstance(visual.get('labels'), dict), 'Visualization labels must be an object'
    for key, value in visual['labels'].items():
        text(key, 'label variable')
        text(value, 'label text')
    assert public_signatures(solution) == public_signatures(starter), 'Starter and reference public signatures differ'
    adapter_functions = {node.name: node for node in ast.parse(adapter).body if isinstance(node, ast.FunctionDef)}
    assert 'run' in adapter_functions, 'Adapter must define run(ns, case)'
    for name, arity in (('run', 2), ('check', 3), ('validate_source', 1)):
        if name in adapter_functions:
            assert len(adapter_functions[name].args.args) == arity, f'Adapter {name} expects {arity} parameters'
    assert isinstance(tests, list) and len(tests) >= 5, 'Need at least five meaningful tests'
    names, inputs = set(), set()
    for fixture in tests:
        assert isinstance(fixture, dict), 'Each fixture must be an object'
        assert set(fixture) == {'name', 'input', 'expected'}, 'Authored fixtures require name/input/expected only; evaluateOnly is for custom runs'
        text(fixture['name'], 'Fixture name')
        assert fixture['name'] not in names, 'Duplicate fixture name: ' + fixture['name']
        names.add(fixture['name'])
        assert isinstance(fixture['input'], dict), 'Fixture input must be an object'
        json_value(fixture)
        canonical = json.dumps(fixture['input'], sort_keys=True, separators=(',', ':'), allow_nan=False)
        assert canonical not in inputs, 'Duplicate fixture input: ' + fixture['name']
        inputs.add(canonical)


def package_hashes(path):
    return {name: hashlib.sha256((Path(path) / name).read_bytes()).hexdigest() for name in PACKAGE_FILES}


def validate_teaching_figures(explanation):
    """Keep static example diagrams attached to real steps and well-formed cells."""
    if 'keyDecision' in explanation:
        text(explanation['keyDecision'], 'keyDecision')
    figures = explanation.get('figures', [])
    assert isinstance(figures, list), 'figures must be a list'
    for figure in figures:
        assert isinstance(figure, dict), 'Figure must be an object'
        text(figure.get('title'), 'Figure title')
        text(figure.get('caption'), 'Figure caption')
        step = figure.get('afterStep')
        assert type(step) is int and 0 <= step < len(explanation['walkthrough']['steps']), 'Figure must follow an existing walkthrough step'
        panels = figure.get('panels')
        assert isinstance(panels, list) and len(panels) >= 2, 'Figure needs at least two panels'
        for panel in panels:
            assert isinstance(panel, dict), 'Panel must be an object'
            text(panel.get('title'), 'Panel title')
            text(panel.get('note'), 'Panel note')
            rows = panel.get('rows')
            assert isinstance(rows, list) and rows, 'Panel needs rows'
            for row in rows:
                assert isinstance(row, dict), 'Figure row must be an object'
                text(row.get('label'), 'Row label')
                values = row.get('values')
                string_list(values, 'Row values')
                if 'labels' in row:
                    assert isinstance(row['labels'], list) and len(row['labels']) == len(values), 'Cell labels must match cell count'
                    assert all(isinstance(label, str) for label in row['labels']), 'Cell labels must be strings'
                if 'highlight' in row:
                    assert isinstance(row['highlight'], list), 'Cell highlights must be a list'
                    assert all(type(i) is int and 0 <= i < len(values) for i in row['highlight']), 'Highlighted cell is out of range'
                if 'columns' in row:
                    columns = row['columns']
                    assert type(columns) is int and 1 <= columns <= len(values) and len(values) % columns == 0, 'Grid needs a whole number of rows'
                if 'connector' in row:
                    text(row['connector'], 'Row connector')


def validate_review(path, entry):
    """Any changed package file invalidates its recorded review fingerprint."""
    assert entry.get('reviewed') and entry.get('resolved'), 'Package review is incomplete'
    hashes = entry.get('packageHashes')
    assert isinstance(hashes, dict), 'Review must fingerprint all six package files'
    current = package_hashes(path)
    changed = [name for name in PACKAGE_FILES if hashes.get(name) != current[name]]
    assert not changed, 'Package changed since review: ' + ', '.join(changed)
    editorial = entry.get('editorialReview', {})
    assert editorial.get('reviewed') and editorial.get('status') == 'approved', 'Editorial review is incomplete'
    assert editorial.get('explanationHash') == current['explanation.json'], 'Editorial review hash is stale'
