"""Validate authored conceptual lessons and their offline, code-independent visuals."""
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def renderer_data(path):
    source = path.read_text()
    match = re.search(r'const drawings:\s*ConceptDrawings\s*=\s*(\{.*\});\s*export default drawings;', source, re.S)
    assert match, f'Invalid authored diagram module: {path.name}'
    assert 'runtime' not in source and 'Python' not in source, 'Concept renderer must be independent of execution'
    return json.loads(match[1])

def concept_fingerprint(slug):
    explanation = ROOT / 'public/problems' / slug / 'explanation.json'
    concept = json.loads(explanation.read_text())['concept']
    files = [ROOT / 'src/components/concepts/diagrams' / f'{slug}.ts']
    files += [ROOT / 'public' / art['src'] for art in concept['illustrations']]
    files += [p.parent / 'generation.json' for p in files[1:]]
    return {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}

def validate_concept(slug, explanation, root=ROOT):
    concept = explanation.get('concept')
    assert isinstance(concept, dict), 'Required conceptual lesson is missing'
    def prose(value, minimum, name):
        assert isinstance(value, str) and len(value.strip()) >= minimum, f'Concept {name} needs substantive prose'
        assert not re.search(r'\b(?:def |class |import |self\.|len\(|True\b|False\b)|\b[a-z]+_[a-z]+\b', value), f'Concept {name} contains source syntax or variables'
    for key in ('question', 'observation', 'correctness'):
        prose(concept.get(key), 30 if key != 'correctness' else 140, key)
    for key, size in [('intuition', 2), ('approach', 3), ('pitfalls', 2)]:
        values = concept.get(key)
        assert isinstance(values, list) and len(values) >= size, f'Concept needs {size} {key} entries'
        for value in values: prose(value, 15 if key == 'approach' else 20, key)
    complexity = concept.get('complexity', {})
    for key in ('time', 'space'): prose(complexity.get(key), 4, key)
    prose(complexity.get('explanation'), 80, 'cost explanation')
    scenes = concept.get('scenes')
    assert isinstance(scenes, list) and len(scenes) >= 6, 'Concept needs at least six authored scenes'
    ids = [scene.get('id') for scene in scenes]
    assert all(isinstance(id, str) and re.fullmatch(r'[a-z0-9-]+', id) for id in ids), 'Scene IDs must be stable slugs'
    assert len(set(ids)) == len(ids), 'Scene IDs must be unique'
    for scene in scenes:
        for field, size in [('title', 8), ('narration', 30), ('decision', 20)]: prose(scene.get(field), size, f'scene {field}')
    assert len({s['narration'] for s in scenes}) == len(scenes), 'Scene narrations must be distinct'
    words = sum(len(re.findall(r'\S+', s['narration'] + ' ' + s['decision'])) for s in scenes)
    assert words >= 180, 'Scene narrative must develop the complete reasoning'
    renderer = root / 'src/components/concepts/diagrams' / f'{slug}.ts'
    assert renderer.is_file(), 'Problem-specific renderer is missing'
    drawings = renderer_data(renderer)
    assert set(drawings) == set(ids), 'Every scene must have exactly one drawing'
    for id, drawing in drawings.items():
        assert isinstance(drawing.get('description'), str) and len(drawing['description']) >= 30, f'{id}: accessible drawing description missing'
        shapes = drawing.get('shapes')
        assert isinstance(shapes, list) and len(shapes) >= 2, f'{id}: drawing composition missing'
        for shape in shapes:
            assert shape['type'] in ('box', 'circle', 'text', 'path'), f'{id}: unsupported shape'
            if shape['type'] == 'path':
                assert isinstance(shape.get('d'), str) and shape['d'].startswith('M '), f'{id}: invalid path'
            else:
                assert isinstance(shape.get('label'), str), f'{id}: shape label missing'
                assert 0 <= shape['x'] <= 720 and 0 <= shape['y'] <= 400, f'{id}: shape lies outside diagram'
                if shape['type'] in ('box', 'circle'):
                    width = shape.get('width', 72)
                    height = shape.get('height', 58) if shape['type'] == 'box' else width
                    assert width > 0 and height > 0 and width/2 <= shape['x'] <= 720-width/2, f'{id}: shape clips horizontally'
                    assert height/2 <= shape['y'] <= 400-height/2, f'{id}: shape clips vertically'
    registry = (root / 'src/components/concepts/registry.ts').read_text()
    assert re.search(rf'(?:"{re.escape(slug)}"|\b{re.escape(slug)})\s*:\s*\(\)\s*=>\s*import\("\./diagrams/{re.escape(slug)}"\)', registry), 'Renderer must load on demand through the registry'
    artwork = concept.get('illustrations')
    assert isinstance(artwork, list) and artwork, 'Concept illustration is required'
    for art in artwork:
        for key in ('alt', 'caption'): prose(art.get(key), 40, f'illustration {key}')
        assert isinstance(art.get('prompt'), str) and len(art['prompt']) >= 100, 'Generation prompt missing'
        relative = art.get('src', '')
        assert relative.startswith(f'illustrations/{slug}/') and '..' not in relative, 'Artwork must be local and scoped by problem'
        path = root / 'public' / relative
        assert path.is_file(), 'Concept artwork file is missing'
        data = path.read_bytes()
        assert data[:4] == b'RIFF' and data[8:12] == b'WEBP' and len(data) > 1000, 'Concept artwork must be a valid packaged WebP'
        generation = json.loads((path.parent / 'generation.json').read_text())
        assert generation['tool'] == 'image_gen.imagegen', 'Use the built-in ImageGen tool'
        assert generation['prompt'] == art['prompt'], 'Artwork prompt must match its generation record'
        assert generation['width'] >= 720 and generation['height'] >= 400, 'Artwork resolution is too small'
    return len(scenes)
