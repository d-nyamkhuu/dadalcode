"""Small manuscript helpers. Authors supply every claim and example state."""
import json
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
geometry = runpy.run_path(str(ROOT/'scripts/author-concepts.py'))
draw = geometry['drawing']
text = geometry['text']
box = geometry['box']
arrow = geometry['arrow']
path = ROOT/'scripts/concept-manuscripts.json'
manuscripts = json.loads(path.read_text())

def lanes(title, before, after, first='Before', second='After', active=(), linked=False, footer=''):
    return draw(title,[{'label':first,'values':before},{'label':second,'values':after,'active':list(active),'linked':linked}],footer,linked)

def scene(title, narration, decision, picture):
    return dict(title=title,narration=narration,decision=decision,drawing=picture)

def add(slug, question, bottleneck, insight, rule, approach, examples, proof, boundary, start, cost, pitfalls, art):
    first=scene('The question',question,rule,start)
    slow=scene('The obstacle',bottleneck,insight,start)
    idea=scene('The useful observation',insight,rule,examples[0]['drawing'])
    reason=scene('Why the answer is complete',proof,rule,examples[-1]['drawing'])
    edge=scene('A boundary to remember',boundary[0],boundary[1],boundary[2])
    manuscripts[slug]=dict(question=question,intuition=[bottleneck,insight],observation=rule,approach=approach,
        correctness=proof,cost=cost,pitfalls=pitfalls,artAlt=art,artCaption=art,scenes=[first,slow,idea,*examples,reason,edge])

def save():
    path.write_text(json.dumps(manuscripts,indent=2,ensure_ascii=False)+'\n')
    print(f'{len(manuscripts)} manuscripts ready')

def grid_picture(title, matrix, active=(), route=(), footer=''):
    shapes=[text(title)]
    rows=len(matrix);cols=len(matrix[0]) if rows else 0
    size=min(54,260/max(rows,1),620/max(cols,1))
    origin_x=360-(cols-1)*size/2;origin_y=106
    for r,row in enumerate(matrix):
        for c,value in enumerate(row):
            s=box(value,origin_x+c*size,origin_y+r*size,'active' if [r,c] in active or (r,c) in active else 'context',width=size-6);s['height']=size-6;shapes.append(s)
    for a,b in zip(route,route[1:]):
        shapes.append(arrow(origin_x+a[1]*size,origin_y+a[0]*size,origin_x+b[1]*size,origin_y+b[0]*size,'active'))
    if footer:shapes.append(text(footer,y=378,size=16,tone='active'))
    return {'description':title+'. Rows: '+str(matrix)+('. '+footer if footer else ''),'shapes':shapes}

def skyline(title, heights, water=None, walls=(), footer=''):
    shapes=[text(title)];max_height=max(heights+[1]);step=min(64,620/max(len(heights),1));origin=360-(len(heights)-1)*step/2
    for i,v in enumerate(heights):
        height=v/max_height*200
        if v:
            s=box(str(v),origin+i*step,320-height/2,'active' if i in walls else 'muted',width=step-8);s['height']=height;shapes.append(s)
        else:
            shapes.append(text('0',origin+i*step,318,12,'muted'))
        shapes.append(text(i,origin+i*step,344,12,'muted'))
        if water and water[i]:
            wh=water[i]/max_height*200
            w=box(str(water[i]),origin+i*step,320-height-wh/2,'context',width=step-8);w['height']=max(22,wh);shapes.append(w)
    if footer:shapes.append(text(footer,y=378,size=16,tone='active'))
    return {'description':title+'. Heights '+str(heights)+'. '+footer,'shapes':shapes}

def intervals_picture(title, intervals, selected=(), footer=''):
    shapes=[text(title)];lo=min([a for a,b in intervals]+[0]);hi=max([b for a,b in intervals]+[1]);span=max(hi-lo,1)
    for i,(a,b) in enumerate(intervals):
        y=104+i*min(48,230/max(len(intervals),1));x1=66+(a-lo)/span*580;x2=66+(b-lo)/span*580;tone='active' if i in selected else 'context'
        shapes+=[dict(type='path',d=f'M {x1} {y} L {x2} {y}',tone=tone),text(a,x1,y-12,12,tone),text(b,x2,y-12,12,tone)]
        shapes.append(dict(type='path',d=f'M {x1} {y-5} L {x1} {y+5} M {x2} {y-5} L {x2} {y+5}',tone=tone))
    if footer:shapes.append(text(footer,y=378,size=16,tone='active'))
    return {'description':title+'. Intervals '+str(intervals)+'. '+footer,'shapes':shapes}

def branching(title, root, branches, footer=''):
    shapes=[text(title),box(root,360,112,'active',width=130)]
    count=len(branches);step=620/max(count,1);origin=360-(count-1)*step/2
    for i,value in enumerate(branches):
        x=origin+i*step;shapes+=[arrow(360,143,x,245),box(value,x,276,width=min(130,step-12))]
    if footer:shapes.append(text(footer,y=378,size=16,tone='active'))
    return {'description':title+'. '+str(root)+' leads to '+str(branches)+'. '+footer,'shapes':shapes}

def tree_picture(title, values, active=(), footer='', active_indices=None):
    if not values or values[0] is None:return {'description':title+'. Empty tree.','shapes':[text(title),text('empty tree',y=205)]}
    nodes=[{'value':values[0],'children':[]}];queue=[0];cursor=1
    for index in queue:
        for side in range(2):
            if cursor>=len(values):break
            value=values[cursor];cursor+=1
            if value is not None:
                child=len(nodes);nodes.append({'value':value,'children':[]});nodes[index]['children'].append((side,child));queue.append(child)
    ranks={};depths={};order=[]
    def visit(i,depth):
        child=dict(nodes[i]['children'])
        if 0 in child:visit(child[0],depth+1)
        ranks[i]=len(order);order.append(i);depths[i]=depth
        if 1 in child:visit(child[1],depth+1)
    visit(0,0);maxdepth=max(depths.values());coords={i:(60+(ranks[i]+.5)*600/len(nodes),100+depths[i]*min(80,240/max(maxdepth,1))) for i in range(len(nodes))}
    shapes=[text(title)]
    for i,node in enumerate(nodes):
        x,y=coords[i]
        for side,child in node['children']:
            cx,cy=coords[child];shapes.append(arrow(x,y+24,cx,cy-25,'active' if (i in active_indices and child in active_indices if active_indices is not None else node['value'] in active and nodes[child]['value'] in active) else 'context'))
    for i,node in enumerate(nodes):
        x,y=coords[i];shapes.append(dict(type='circle',x=x,y=y,label=str(node['value']),width=min(52,520/max(len(nodes),1)),tone='active' if (i in active_indices if active_indices is not None else node['value'] in active) else 'context'))
    if footer:shapes.append(text(footer,y=380,size=15,tone='active'))
    return {'description':title+'. Tree in level order '+str(values).replace('None','empty')+'. '+footer,'shapes':shapes}

def graph_picture(title,nodes,edges,active=(),directed=False,footer=''):
    import math
    count=len(nodes);coords={value:(360+165*math.cos(-math.pi/2+i*2*math.pi/max(count,1)),213+130*math.sin(-math.pi/2+i*2*math.pi/max(count,1))) for i,value in enumerate(nodes)};shapes=[text(title)]
    for a,b in edges:
        if a not in coords or b not in coords:continue
        x,y=coords[a];xx,yy=coords[b];dx=xx-x;dy=yy-y;length=max(math.hypot(dx,dy),1)
        shapes.append(dict(type='path',d=f'M {x+dx/length*29} {y+dy/length*29} L {xx-dx/length*29} {yy-dy/length*29}',arrow=directed,tone='active' if a in active and b in active else 'context'))
    for value,(x,y) in coords.items():shapes.append(dict(type='circle',x=x,y=y,label=str(value),width=56,tone='active' if value in active else 'context'))
    if footer:shapes.append(text(footer,y=380,size=15,tone='active'))
    return {'description':title+'. Nodes '+str(nodes)+', edges '+str(edges)+'. '+footer,'shapes':shapes}
