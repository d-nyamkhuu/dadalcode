from __future__ import annotations
from typing import List
class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        result, path = [], []
        def search(start):
            # Every prefix choice is already one valid subset.
            result.append(path.copy())
            for i in range(start, len(nums)):
                path.append(nums[i])
                # Increasing indices uniquely identify each subset.
                search(i + 1)
                path.pop()
        search(0)
        return result
