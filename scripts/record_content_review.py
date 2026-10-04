"""Record fingerprints after reviewing a problem package's six source files."""
import argparse
import json
from pathlib import Path

from content_contracts import package_hashes

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--slug', action='append', required=True, help='Reviewed package; repeat for multiple packages')
args = parser.parse_args()
ledger_path = ROOT / 'tests/review-ledger.json'
ledger = json.loads(ledger_path.read_text())
by_slug = {entry['slug']: entry for entry in ledger}
unknown = set(args.slug) - by_slug.keys()
if unknown:
    parser.error('Unknown problem(s): ' + ', '.join(sorted(unknown)))
for slug in dict.fromkeys(args.slug):
    entry = by_slug[slug]
    hashes = package_hashes(ROOT / 'public/problems' / slug)
    entry.update(reviewed=True, resolved=True, packageHashes=hashes)
    entry.setdefault('editorialReview', {}).update(
        reviewed=True, status='approved', explanationHash=hashes['explanation.json'])
ledger_path.write_text(json.dumps(ledger, indent=2, ensure_ascii=False) + '\n')
print(f'Recorded reviewed package fingerprints for {len(set(args.slug))} problem(s).')
