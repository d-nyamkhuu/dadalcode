from typing import List
class Solution:
    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:
        rows, cols = len(heights), len(heights[0])
        def reach(seeds):
            seen = set(seeds)
            stack = list(seen)
            while stack:
                r, c = stack.pop()
                for dr, dc in ((1,0),(-1,0),(0,1),(0,-1)):
                    nr, nc = r + dr, c + dc
                    # Reverse flow: higher neighbors can drain into this cell.
                    if 0 <= nr < rows and 0 <= nc < cols and (nr,nc) not in seen and heights[nr][nc] >= heights[r][c]:
                        seen.add((nr,nc))
                        stack.append((nr,nc))
            return seen
        pacific = reach([(0,c) for c in range(cols)] + [(r,0) for r in range(rows)])
        atlantic = reach([(rows-1,c) for c in range(cols)] + [(r,cols-1) for r in range(rows)])
        # Scan coordinates in row-major order for deterministic output without sorting.
        return [[r, c] for r in range(rows) for c in range(cols)
                if (r, c) in pacific and (r, c) in atlantic]
