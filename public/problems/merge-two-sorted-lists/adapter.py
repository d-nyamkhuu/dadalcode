def run(ns, case):
    a, b = build_list(case['list1']), build_list(case['list2'])
    originals = {}
    for node in (a, b):
        while node is not None:
            originals[id(node)] = (node, node.val)
            node = node.next
    result = ns['Solution']().mergeTwoLists(a, b)
    values, used = [], set()
    while result is not None:
        identity = id(result)
        if identity in used or identity not in originals:
            raise ValueError('Result must relink original nodes without replacements or cycles')
        used.add(identity)
        values.append(result.val)
        result = result.next
    if len(used) != len(originals):
        raise ValueError('Every input node must appear once')
    if any(type(node.val) is not int or node.val != value
           for node, value in originals.values()):
        raise ValueError('Do not change original node values')
    return values
