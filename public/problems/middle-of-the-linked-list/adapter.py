def run(ns, case):
    head = build_list(case['head'])
    nodes = []
    node = head
    while node:
        nodes.append(node)
        node = node.next
    result = ns['Solution']().middleNode(head)
    if result is not nodes[len(nodes)//2]:
        raise ValueError('Return the original middle node')
    return list_values(result)
