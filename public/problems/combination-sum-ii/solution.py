from __future__ import annotations
from typing import List
class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates = sorted(candidates)
        result, path = [], []
        def search(start, remaining):
            if remaining == 0:
                # The mutable path will be changed on backtracking, so copy it.
                result.append(path.copy())
                return
            for i in range(start, len(candidates)):
                if i > start and candidates[i] == candidates[i - 1]:
                    # Equal siblings would generate identical value combinations.
                    continue
                value = candidates[i]
                if value > remaining:
                    # Every later sorted value also exceeds the remaining budget.
                    break
                path.append(value)
                search(i + 1, remaining - value)
                path.pop()
        search(0, target)
        return result
