def run(ns, case):
    board = [list(row) for row in case['board']]
    ns['Solution']().solveSudoku(board)
    if len(board) != 9 or any(len(row) != 9 for row in board):
        raise ValueError('The board must remain 9 by 9')
    for row in range(9):
        for col in range(9):
            if case['board'][row][col] != '.' and board[row][col] != case['board'][row][col]:
                raise ValueError('Do not change fixed clues')
    digits = set('123456789')
    if any(set(row) != digits for row in board):
        raise ValueError('Every completed row must contain digits 1 through 9')
    if any({board[row][col] for row in range(9)} != digits for col in range(9)):
        raise ValueError('Every completed column must contain digits 1 through 9')
    for top in (0, 3, 6):
        for left in (0, 3, 6):
            if {board[row][col] for row in range(top, top + 3)
                    for col in range(left, left + 3)} != digits:
                raise ValueError('Every completed box must contain digits 1 through 9')
    return [''.join(row) for row in board]
