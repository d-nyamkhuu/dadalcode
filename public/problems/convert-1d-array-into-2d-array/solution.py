from typing import List
class Solution:
    def construct2DArray(self, original: List[int], m: int, n: int) -> List[List[int]]:
        if len(original) != m * n:
            return []
        result = []
        for row in range(m):
            start = row * n
            # A row consists of the next consecutive n original values.
            result.append(original[start:start+n])
        return result
