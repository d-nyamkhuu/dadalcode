"""Validate curriculum completeness and execute its references with the shared harness."""
import argparse, json, pathlib, sys, signal, importlib.util, re
from content_contracts import validate_package, validate_review
ROOT=pathlib.Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('harness',ROOT/'src/runtime/harness.py'); harness=importlib.util.module_from_spec(spec); spec.loader.exec_module(harness)
parser=argparse.ArgumentParser();parser.add_argument('--slug');parser.add_argument('--available',action='store_true');parser.add_argument('--json',action='store_true');parser.add_argument('--check-review',action='store_true',help='Require current reviews of all six package files');args=parser.parse_args()
catalog=json.loads((ROOT/'src/data/catalog.json').read_text()); failures=[]; checked=0; total_cases=0; details=[]
editorials_checked=0; annotated_blocks=0
required=['slug','headline','statement','prerequisites','constraints','intuition','approach','correctness','bruteForce','complexity','pitfalls','sources','visualization']
package_files=['lesson.json','explanation.json','solution.py','starter.py','tests.json','adapter.py']
reviews = {entry['slug']: entry for entry in json.loads((ROOT/'tests/review-ledger.json').read_text())} if args.check_review else {}

def nonempty_text(value):
    return isinstance(value,str) and bool(value.strip())

def validate_explanation(explanation,code,tests):
    """Validate editorial structure and its links to executable teaching content."""
    assert isinstance(explanation,dict),'Editorial must be a JSON object'
    intuition=explanation.get('intuition')
    assert isinstance(intuition,list) and len(intuition)>=2,'Editorial needs at least two intuition paragraphs'
    assert all(nonempty_text(paragraph) for paragraph in intuition),'Editorial intuition paragraphs must be nonempty strings'
    walkthrough=explanation.get('walkthrough')
    assert isinstance(walkthrough,dict),'Editorial walkthrough must be an object'
    assert isinstance(walkthrough.get('input'),dict),'Editorial walkthrough input must be an object'
    assert 'result' in walkthrough,'Editorial walkthrough must include its result'
    steps=walkthrough.get('steps')
    assert isinstance(steps,list) and len(steps)>=4,'Editorial needs at least four walkthrough steps'
    assert all(nonempty_text(step) for step in steps),'Editorial walkthrough steps must be nonempty strings'
    notes=explanation.get('codeNotes')
    assert isinstance(notes,list) and len(notes)>=3,'Editorial needs at least three annotated code blocks'
    for index,note in enumerate(notes):
        assert isinstance(note,dict),f'Editorial code note {index+1} must be an object'
        assert nonempty_text(note.get('code')),f'Editorial code note {index+1} needs a nonempty code snippet'
        assert nonempty_text(note.get('note')),f'Editorial code note {index+1} needs a nonempty explanation'
        assert note['code'] in code,f'Editorial code note {index+1} does not match an exact reference-code substring'
    # Compare JSON representations to preserve value types as well as contents;
    # Python equality alone would consider True and 1 interchangeable.
    def canonical(value):
        return json.dumps(value,sort_keys=True,separators=(',',':'),allow_nan=False)
    assert any(canonical(walkthrough['input'])==canonical(test['input'])
               and canonical(walkthrough['result'])==canonical(test['expected'])
               for test in tests),'Editorial walkthrough input/result must match the same authored fixture'
    prose=intuition+steps+[note['note'] for note in notes]
    words=sum(len(re.findall(r'\S+',text)) for text in prose)
    assert words>=180,f'Editorial prose is too short: {words} words; at least 180 required'
    return words,len(notes)

def timeout(signum,frame): raise TimeoutError('Reference exceeded 3 seconds')
signal.signal(signal.SIGALRM,timeout)
for entry in catalog:
    slug=entry['slug']
    if args.slug and slug!=args.slug: continue
    path=ROOT/'public/problems'/slug
    if args.available and not all((path/n).exists() for n in package_files):continue
    try:
        lesson=json.loads((path/'lesson.json').read_text()); tests=json.loads((path/'tests.json').read_text())
        code=(path/'solution.py').read_text();adapter=(path/'adapter.py').read_text();starter=(path/'starter.py').read_text();compile(starter,str(path/'starter.py'),'exec')
        validate_package(lesson,tests,code,starter,adapter)
        if args.check_review: validate_review(path,reviews.get(slug,{}))
        assert lesson['slug']==slug,'Mismatched slug'
        for key in required: assert key in lesson and lesson[key],f'Missing/empty {key}'
        assert len(tests)>=5,'Need at least five meaningful tests'
        assert len(lesson['statement'])>=60,'Statement too short'
        assert len(lesson['correctness'])>=60,'Correctness explanation too short'
        assert all('input' in t and 'expected' in t and 'name' in t for t in tests),'Invalid fixture'
        explanation=json.loads((path/'explanation.json').read_text())
        editorial_words,note_count=validate_explanation(explanation,code,tests)
        editorials_checked+=1;annotated_blocks+=note_count
        for index,case in enumerate(tests):
            signal.alarm(3)
            try: out=harness.run_case(code,adapter,case,trace=index==0,config=lesson['visualization'])
            finally: signal.alarm(0)
            result=out['result'];total_cases+=1
            assert result['passed'],f"{case['name']}: expected {case['expected']!r}, got {result['actual']!r}; {result['error'] or ''}"
            if index==0: assert len(out['steps'])>0,'No reference trace steps'
        checked+=1;details.append({'slug':slug,'tests':len(tests),'editorialWords':editorial_words,'annotatedBlocks':note_count,'passed':True})
    except Exception as exc:
        failures.append({'slug':slug,'error':str(exc)});details.append({'slug':slug,'passed':False,'error':str(exc)})
if args.json: print(json.dumps({'checked':checked,'cases':total_cases,'editorials':editorials_checked,'annotatedBlocks':annotated_blocks,'failures':failures,'details':details},indent=2))
else:
    for fail in failures: print(f"FAIL {fail['slug']}: {fail['error']}")
    print(f'{checked} problems / {total_cases} cases passed; {editorials_checked} editorials / {annotated_blocks} annotated code blocks; {len(failures)} failures')
sys.exit(bool(failures))
