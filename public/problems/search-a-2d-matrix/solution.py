class Solution:
    def searchMatrix(self, matrix: list[list[int]], target: int) -> bool:
        columns = len(matrix[0])
        left, right = 0, len(matrix) * columns - 1
        while left <= right:
            mid = (left + right) // 2
            row, col = divmod(mid, columns)
            value = matrix[row][col]
            if value == target:
                return True
            # Flattened order is globally sorted, so one entire half is impossible.
            if value < target:
                left = mid + 1
            else:
                right = mid - 1
        return False
