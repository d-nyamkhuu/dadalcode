def run(ns, case):
    head = build_list(case['head'])
    nodes = []
    node = head
    while node:
        nodes.append(node)
        node = node.next
    if case['pos'] >= 0:
        nodes[-1].next = nodes[case['pos']]
    links = [node.next for node in nodes]
    result = ns['Solution']().detectCycle(head)
    if any(node.next is not link for node,link in zip(nodes,links)):
        raise ValueError('detectCycle must not change input links')
    if result is None:
        return -1
    for i,node in enumerate(nodes):
        if result is node:
            return i
    raise ValueError('Return an original input node by identity')
