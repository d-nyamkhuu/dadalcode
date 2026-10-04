from typing import List
class Solution:
    def maxSubArray(self, nums: List[int]) -> int:
        ending = best = nums[0]
        for i in range(1, len(nums)):
            value = nums[i]
            # A negative prefix is discarded by starting a new subarray.
            ending = max(value, ending + value)
            best = max(best, ending)
        return best
