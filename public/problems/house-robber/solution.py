from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        two_back = one_back = 0
        for i, amount in enumerate(nums):
            # Taking today forbids yesterday; skipping keeps yesterday's best.
            current = max(one_back, two_back + amount)
            two_back, one_back = one_back, current
        return one_back
