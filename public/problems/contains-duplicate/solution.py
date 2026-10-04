from typing import List
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for i, value in enumerate(nums):
            if value in seen:
                # This value has an earlier occurrence.
                return True
            # Remember a first occurrence for every later membership check.
            seen.add(value)
        return False
