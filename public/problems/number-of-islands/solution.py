from collections import deque
class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        """Return the number of islands in a rectangular character grid.

        grid[row][col] is "1" for land or "0" for water, not an integer."""
        rows, cols = len(grid), len(grid[0])
        islands = 0
        for row in range(rows):
            for col in range(cols):
                if grid[row][col] != '1':
                    continue
                # This unvisited cell is the first representative of a new component.
                islands += 1
                grid[row][col] = '0'
                queue = deque([(row, col)])
                while queue:
                    r, c = queue.popleft()
                    for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                        nr, nc = r + dr, c + dc
                        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == '1':
                            # Mark now so another neighbor cannot enqueue the same land.
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))
        return islands
