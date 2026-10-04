from collections import Counter

def run(ns, case):
    return ns['Solution']().kClosest(case['points'], case['k'])

def check(actual, expected, case):
    if not isinstance(actual, list) or len(actual) != case['k']:
        return False
    if any(not isinstance(p, list) or len(p) != 2 or any(type(x) is not int for x in p) for p in actual):
        return False
    available = Counter(map(tuple, case['points']))
    chosen = Counter(map(tuple, actual))
    if any(count > available[point] for point, count in chosen.items()):
        return False
    distances = sorted(x*x + y*y for x, y in actual)
    optimal = sorted(x*x + y*y for x, y in case['points'])[:case['k']]
    return distances == optimal
