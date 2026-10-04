from __future__ import annotations
from typing import List
class Solution:
    def findPeakElement(self, nums: List[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            if nums[mid] < nums[mid + 1]:
                # The uphill side must eventually reach a peak.
                left = mid + 1
            else:
                # The middle can itself be a peak, so keep it.
                right = mid
        return left
