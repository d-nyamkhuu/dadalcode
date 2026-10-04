def run(ns, case):
    matrix = case['matrix']
    ns['Solution']().setZeroes(matrix)
    return matrix
