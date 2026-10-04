def run(ns, case):
    return ns['Solution']().solveNQueens(case['n'])
def check(actual, expected, case):
    if not isinstance(actual, list): return False
    n = case['n']
    seen = set()
    for board in actual:
        if not isinstance(board, list) or len(board) != n: return False
        columns, down, up = set(), set(), set()
        for r, row in enumerate(board):
            if not isinstance(row, str) or len(row) != n or row.count('Q') != 1 or any(c not in '.Q' for c in row): return False
            c = row.index('Q')
            if c in columns or r-c in down or r+c in up: return False
            columns.add(c); down.add(r-c); up.add(r+c)
        key = tuple(board)
        if key in seen: return False
        seen.add(key)
    return len(seen) == len(expected)
