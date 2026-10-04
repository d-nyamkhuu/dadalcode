from __future__ import annotations
from typing import List
class Solution:
    def setZeroes(self, matrix: List[List[int]]) -> None:
        rows, cols = len(matrix), len(matrix[0])
        first_row_zero = any(matrix[0][col] == 0 for col in range(cols))
        first_col_zero = any(matrix[row][0] == 0 for row in range(rows))
        for row in range(1, rows):
            for col in range(1, cols):
                if matrix[row][col] == 0:
                    # Store each original zero's effects in dedicated headers.
                    matrix[row][0] = 0
                    matrix[0][col] = 0
        for row in range(1, rows):
            for col in range(1, cols):
                if matrix[row][0] == 0 or matrix[0][col] == 0:
                    matrix[row][col] = 0
        if first_row_zero:
            # Headers are no longer needed, so the first row can now be cleared.
            for col in range(cols):
                matrix[0][col] = 0
        if first_col_zero:
            for row in range(rows):
                matrix[row][0] = 0
