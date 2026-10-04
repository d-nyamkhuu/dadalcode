class Solution:
    def searchMatrix(self, matrix, target: int) -> bool:
        row, col = 0, len(matrix[0]) - 1
        while row < len(matrix) and col >= 0:
            value = matrix[row][col]
            if value == target:
                return True
            # This whole column is too large, including every cell below.
            if value > target:
                col -= 1
            else:
                # This whole row is too small, including every cell left.
                row += 1
        return False
