def run(ns, case):
    return ns['Solution']().alienOrder(case['words'])
def check(actual, expected, case):
    if expected == '':
        return actual == ''
    letters = set(''.join(case['words']))
    if not isinstance(actual, str) or len(actual) != len(letters) or set(actual) != letters:
        return False
    rank = {char: i for i, char in enumerate(actual)}
    for first, second in zip(case['words'], case['words'][1:]):
        for a, b in zip(first, second):
            if a != b:
                if rank[a] >= rank[b]:
                    return False
                break
        else:
            if len(first) > len(second):
                return False
    return True
