"""Build authored concept packages and lazy diagram modules from the manuscript.

Geometry helpers draw only the state supplied by the author. They never execute
reference Python or infer an explanation from an execution trace.
"""
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/components/concepts/diagrams'
OUT.mkdir(parents=True, exist_ok=True)

def text(label, x=360, y=46, size=20, tone='context', anchor='middle'):
    return dict(type='text', x=x, y=y, label=str(label), size=size, tone=tone, anchor=anchor)

def box(label, x, y, tone='context', detail=None, width=72):
    shape = dict(type='box', x=x, y=y, label=str(label), tone=tone, width=width)
    if detail: shape['detail'] = detail
    return shape

def arrow(x1, y1, x2, y2, tone='context', dashed=False):
    return dict(type='path', d=f'M {x1} {y1} L {x2} {y2}', arrow=True, tone=tone, dashed=dashed)

def strip(values, y, label, active=(), linked=False):
    shapes = [text(label, 38, y-54, 14, anchor='start')]
    count = len(values)
    if not count: return shapes + [text('empty', 360, y, 18, 'muted')]
    step = min(104, 624 / max(count, 1))
    origin = 360 - (count-1)*step/2
    for i, value in enumerate(values):
        x = origin+i*step
        shapes.append(box(value, x, y, 'active' if i in active else 'context', width=min(84,step-12)))
        if linked and i < count-1: shapes.append(arrow(x+min(42,(step-12)/2),y,x+step-min(42,(step-12)/2),y))
    return shapes

def drawing(title, lanes, footer='', linked=False):
    shapes = [text(title)]
    for i, lane in enumerate(lanes):
        shapes += strip(lane['values'], 138 + i*138, lane['label'], lane.get('active', []), lane.get('linked', linked))
    if footer: shapes.append(text(footer, y=374, size=16, tone='active'))
    return {'description': title + '. ' + '. '.join(lane['label']+': '+', '.join(map(str,lane['values'])) for lane in lanes) + ('. '+footer if footer else ''), 'shapes':shapes}

def pilot_drawing(slug, index):
    if slug == 'two-sum':
        stages = [([], [], 'Two different positions must fill one target.'), ([], [], 'A pair search repeats comparisons.'), ([], [0], 'Ask for one missing partner.'), (['2 at position 0'], [0], '2 needs 7; remember 2.'), (['2 at position 0'], [1], '7 needs 2; the partner is already remembered.'), (['positions 0 and 1'], [0,1], '2 + 7 = 9'), (['earlier positions only'], [0,1], 'Checking before remembering prevents self-pairing.'), (['two separate copies'], [0,1], 'Separate example: 3 + 3 = 6 needs two positions.')]
        saved,active,footer=stages[index]
        vals=[3,3] if index==7 else [2,7,11,15]
        d=drawing('Find the missing partner', [{'label':'Numbers in order','values':vals,'active':active},{'label':'Remembered information','values':saved}],footer)
        if index in (4,5): d['shapes'] += [dict(type='path',d='M 204 104 Q 256 62 308 104',arrow=True,tone='active')]
        return d
    if slug == 'coin-change':
        rows = [(['1','3','4'],['6']), (['4','1','1'],['3','3']), (['amount 0','amount 3','amount 6'],['0 coins','1 coin','2 coins']), (['0','1','2','3','4','5'],['0','1','2','1','1','2']), (['last coin 1','last coin 3','last coin 4'],['3 coins','2 coins','3 coins']), (['3','3'],['2 coins']), (['6 → 5','6 → 3','6 → 2'],['try every last coin']), (['amount 0'],['0 coins'])]
        a,b=rows[index]
        return drawing('Build six with as few coins as possible', [{'label':'Choices' if index<3 else 'Amounts / last coins','values':a,'active':[1] if index==4 else []},{'label':'Compare total coin counts','values':b,'active':[1] if index==4 else list(range(len(b)))}],['Unlimited coins of each denomination.','Largest first: 3 coins. Better: 2 coins.','A last coin joins a solved smaller amount.','Save the cheapest answer for every smaller amount.','The last coin 3 reuses the answer for amount 3.','3 + 3 = 6. Minimum: two coins.','Every possible composition has a last coin.','Boundary example: no money needs no coins.'][index])
    if slug == 'reverse-linked-list':
        prefix=[[],[],[],[1],[2,1],[5,4,3,2,1],[5,4,3,2,1],[]][index]
        suffix=[[1,2,3,4,5],[1,2,3,4,5],[1,2,3,4,5],[2,3,4,5],[3,4,5],[],[],[]][index]
        return drawing('Keep the route forward while turning links back', [{'label':'Already reversed','values':prefix+['end'] if prefix else [],'active':[0] if prefix else [],'linked':True},{'label':'Still to visit','values':suffix+['end'] if suffix else [],'active':[0] if suffix else [],'linked':True}],['Reverse the arrows; keep the same nodes.','Copying values would lose the original node identities.','Bookmark the next node before changing its link.','1 becomes the tail; the route to 2 stays saved.','2 points back to 1; the route to 3 stays saved.','Start from 5 to read the fully reversed chain.','Each transfer preserves both chains.','Boundary example: an empty list remains empty.'][index])
    raise ValueError(slug)

def concept_cost(value):
    import re
    value = re.sub(r'len\(s\)\s*\+\s*len\(t\)', 'm + n', value)
    value = re.sub(r'len\([^)]+\)', 'n', value)
    return value.replace('w_real', 'w').replace('h_root + h_sub', 'h₁ + h₂').replace('h_main + h_sub', 'h₁ + h₂').replace('h_main+h_sub', 'h₁+h₂').replace('number of active pushes', 'active occurrences').replace('Python ', '')

def build():
    catalog = json.loads((ROOT/'src/data/catalog.json').read_text())
    manuscripts = json.loads((ROOT/'scripts/concept-manuscripts.json').read_text())
    for entry in catalog:
        slug = entry['slug']
        if slug not in manuscripts: continue
        m = manuscripts[slug]
        folder = ROOT/'public/problems'/slug
        editorial = json.loads((folder/'explanation.json').read_text())
        lesson = json.loads((folder/'lesson.json').read_text())
        scenes=[]; diagrams={}
        for i, item in enumerate(m['scenes']):
            scene_id=item['id']
            scenes.append({'id':scene_id,'title':item['title'],'narration':item['narration'],'decision':item['decision']})
            diagrams[scene_id]=pilot_drawing(slug,i) if slug in ('two-sum','coin-change','reverse-linked-list') else item['drawing']
        prompt_path=ROOT/'public/illustrations'/slug/'generation.json'
        prompt=json.loads(prompt_path.read_text())['prompt'] if prompt_path.exists() else next(job['prompt'] for job in json.loads((ROOT/'scripts/concept-art-prompts.json').read_text()) if job['slug']==slug)
        editorial['concept']={
            'question':m['question'],'intuition':m['intuition'], 'observation':m['observation'],
            'approach':m['approach'], 'correctness':m['correctness'],
            'complexity':{'time':concept_cost(lesson['complexity']['time']),'space':concept_cost(lesson['complexity']['space']),'explanation':m['cost']}, 'pitfalls':m['pitfalls'],
            'illustrations':[{'src':f'illustrations/{slug}/concept.webp','alt':m['artAlt'],'caption':m['artCaption'],'prompt':prompt}],
            'scenes':scenes,
        }
        (folder/'explanation.json').write_text(json.dumps(editorial,indent=2,ensure_ascii=False)+'\n')
        (OUT/f'{slug}.ts').write_text('import type { ConceptDrawings } from "../../../types";\nconst drawings: ConceptDrawings = '+json.dumps(diagrams,ensure_ascii=False,indent=2)+';\nexport default drawings;\n')
    registry='import type { ConceptDrawings } from "../../types";\nexport const diagramLoaders: Record<string, () => Promise<{ default: ConceptDrawings }>> = {\n'
    registry+=''.join(f'  "{entry["slug"]}": () => import("./diagrams/{entry["slug"]}"),\n' for entry in catalog if entry['slug'] in manuscripts)
    registry+='};\n'
    (OUT.parent/'registry.ts').write_text(registry)
    print(f'Authored {len(manuscripts)} concept lessons.')

if __name__ == "__main__":
    build()
