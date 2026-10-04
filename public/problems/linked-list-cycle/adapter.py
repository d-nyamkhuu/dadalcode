def run(ns, case):
    nodes = [ListNode(value) for value in case['head']]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    if nodes and case['pos'] >= 0:
        nodes[-1].next = nodes[case['pos']]
    return ns['Solution']().hasCycle(nodes[0] if nodes else None)
