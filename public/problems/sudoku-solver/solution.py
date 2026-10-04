class Solution:
    def solveSudoku(self, board: list[list[str]]) -> None:
        """Fill a 9×9 mutable character grid in place; return None.

        board[row][col] is a digit string "1"–"9", or "." for an empty cell.
        Example rows written as strings are converted to lists of characters
        before this method is called. Preserve all original clues."""
        rows = [set() for _ in range(9)]
        cols = [set() for _ in range(9)]
        boxes = [set() for _ in range(9)]
        empty = []
        digits = set('123456789')
        for row in range(9):
            for col in range(9):
                digit = board[row][col]
                if digit == '.':
                    empty.append((row, col))
                else:
                    rows[row].add(digit)
                    cols[col].add(digit)
                    boxes[(row // 3) * 3 + col // 3].add(digit)

        def visit(index):
            if index == len(empty):
                return True
            # Choose the most constrained remaining cell to prune failures early.
            best_index, best_candidates = index, digits
            for position in range(index, len(empty)):
                row, col = empty[position]
                box_id = (row // 3) * 3 + col // 3
                candidates = digits - rows[row] - cols[col] - boxes[box_id]
                if len(candidates) < len(best_candidates):
                    best_index, best_candidates = position, candidates
                if len(best_candidates) <= 1:
                    break
            if not best_candidates:
                return False
            empty[index], empty[best_index] = empty[best_index], empty[index]
            row, col = empty[index]
            box_id = (row // 3) * 3 + col // 3
            for digit in sorted(best_candidates):
                # Apply one legal choice consistently to all three constraints.
                board[row][col] = digit
                rows[row].add(digit)
                cols[col].add(digit)
                boxes[box_id].add(digit)
                if visit(index + 1):
                    return True
                # Restore the exact prior state before trying another digit.
                board[row][col] = '.'
                rows[row].remove(digit)
                cols[col].remove(digit)
                boxes[box_id].remove(digit)
            empty[index], empty[best_index] = empty[best_index], empty[index]
            return False

        visit(0)
