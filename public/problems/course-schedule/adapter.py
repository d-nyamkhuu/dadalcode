def run(ns, case):
    return ns['Solution']().canFinish(case['numCourses'], case['prerequisites'])
