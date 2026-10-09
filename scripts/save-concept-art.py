"""Package a built-in ImageGen output; prompts are stored alongside each asset."""
import argparse
import json
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('source')
parser.add_argument('slug')
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
prompts = {job['slug']: job['prompt'] for job in json.loads((root / 'scripts/concept-art-prompts.json').read_text())}
destination = root / 'public/illustrations' / args.slug
destination.mkdir(parents=True, exist_ok=True)
with Image.open(args.source) as image:
    image.save(destination / 'concept.webp', 'WEBP', quality=88, method=6)
    dimensions = image.size
(destination / 'generation.json').write_text(json.dumps({
    'tool': 'image_gen.imagegen', 'prompt': prompts[args.slug],
    'width': dimensions[0], 'height': dimensions[1],
}, indent=2) + '\n')
print(args.slug)
