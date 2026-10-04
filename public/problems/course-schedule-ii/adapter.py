def run(ns, case):
    return ns['Solution']().findOrder(case['numCourses'],case['prerequisites'])
def check(actual, expected, case):
    if expected == []:
        return actual == []
    n = case['numCourses']
    if not isinstance(actual,list) or len(actual)!=n or any(type(v) is not int for v in actual) or set(actual)!=set(range(n)):
        return False
    positions = {course:i for i,course in enumerate(actual)}
    return all(positions[before] < positions[after] for after,before in case['prerequisites'])
