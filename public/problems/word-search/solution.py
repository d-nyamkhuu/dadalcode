from collections import Counter

class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        rows, columns = len(board), len(board[0])
        if len(word) > rows * columns:
            return False
        available = Counter(letter for row in board for letter in row)
        if any(available[letter] < count for letter, count in Counter(word).items()):
            return False
        def search(row, col, index):
            if index == len(word):
                return True
            if not (0 <= row < rows and 0 <= col < columns) or board[row][col] != word[index]:
                return False
            letter = board[row][col]
            # A temporary marker prevents this path from revisiting the cell.
            board[row][col] = '#'
            found = (search(row + 1, col, index + 1) or search(row - 1, col, index + 1)
                     or search(row, col + 1, index + 1) or search(row, col - 1, index + 1))
            # Restore even after success so callers keep their original board.
            board[row][col] = letter
            return found
        for row in range(rows):
            for col in range(columns):
                if search(row, col, 0):
                    return True
        return False
