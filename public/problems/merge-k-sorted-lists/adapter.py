def run(ns, case):
    heads = [build_list(values) for values in case['lists']]
    originals = {}
    for node in heads:
        while node is not None:
            originals[id(node)] = (node, node.val)
            node = node.next
    result = ns['Solution']().mergeKLists(heads)
    values, used = [], set()
    while result is not None:
        identity = id(result)
        if identity in used or identity not in originals:
            raise ValueError('Relink every original node once without replacements or cycles')
        used.add(identity)
        values.append(result.val)
        result = result.next
    if len(used) != len(originals):
        raise ValueError('Every input node must appear once')
    if any(type(node.val) is not int or node.val != value
           for node, value in originals.values()):
        raise ValueError('Do not change original node values')
    return values
