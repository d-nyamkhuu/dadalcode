def run(ns, case):
    head = build_list(case['head'])
    original, original_values, node = {}, {}, head
    while node is not None:
        original[id(node)] = node
        original_values[id(node)] = node.val
        node = node.next
    result = ns['Solution']().deleteDuplicates(head)
    values, seen = [], set()
    while result is not None:
        if id(result) not in original or original[id(result)] is not result:
            raise ValueError('Return original list nodes; do not allocate a replacement list')
        if type(result.val) is not int or result.val != original_values[id(result)]:
            raise ValueError('Preserve the value of each retained original node')
        if id(result) in seen:
            raise ValueError('Returned list must not contain a cycle')
        seen.add(id(result))
        values.append(result.val)
        result = result.next
    return values
