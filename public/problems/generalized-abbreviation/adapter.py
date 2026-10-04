def run(ns, case):
    return ns["Solution"]().generateAbbreviations(case['word'])


def check(actual, expected, case):
    import json
    if not isinstance(actual, list):
        return False
    return sorted(json.dumps(x, sort_keys=True) for x in actual) == sorted(json.dumps(x, sort_keys=True) for x in expected)
