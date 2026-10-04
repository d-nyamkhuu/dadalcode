def run(ns, case):
    obj = ns['Trie']()
    result = [None]
    for operation, args in zip(case['operations'][1:], case['args'][1:]):
        result.append(getattr(obj, operation)(*args))
    return result
