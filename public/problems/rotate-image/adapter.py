def run(ns, case):
    matrix = case['matrix']
    ns['Solution']().rotate(matrix)
    return matrix
