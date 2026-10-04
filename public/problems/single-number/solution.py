from typing import List
class Solution:
    def singleNumber(self, nums: List[int]) -> int:
        result = 0
        for i, value in enumerate(nums):
            # Every matching pair eventually cancels to zero.
            result ^= value
        return result
