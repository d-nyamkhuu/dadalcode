from __future__ import annotations
from typing import List
class Solution:
    def rotate(self, matrix: List[List[int]]) -> None:
        n = len(matrix)
        for row in range(n):
            for col in range(row + 1, n):
                # Swap once across the main diagonal to transpose in place.
                matrix[row][col], matrix[col][row] = matrix[col][row], matrix[row][col]
        for row in range(n):
            left, right = 0, n - 1
            while left < right:
                # Reflection turns transposed coordinates into clockwise coordinates.
                matrix[row][left], matrix[row][right] = matrix[row][right], matrix[row][left]
                left += 1
                right -= 1
