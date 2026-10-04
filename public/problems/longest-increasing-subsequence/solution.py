from __future__ import annotations
from typing import List
from bisect import bisect_left
class Solution:
    def lengthOfLIS(self, nums: List[int]) -> int:
        tails = []
        for i, value in enumerate(nums):
            # Lower bound prevents duplicate values from extending the length.
            position = bisect_left(tails, value)
            if position == len(tails):
                tails.append(value)
            else:
                # A smaller tail makes this length easier to extend later.
                tails[position] = value
        return len(tails)
