class Solution:
    def kthSmallest(self, matrix, k):
        n = len(matrix)
        low, high = matrix[0][0], matrix[-1][-1]
        while low < high:
            mid = (low + high) // 2
            row, col, count = n - 1, 0, 0
            while row >= 0 and col < n:
                # A qualifying bottom cell certifies all cells above in its column.
                if matrix[row][col] <= mid:
                    count += row + 1
                    col += 1
                else:
                    row -= 1
            # Find the smallest value threshold containing at least k entries.
            if count < k:
                low = mid + 1
            else:
                high = mid
        return low
