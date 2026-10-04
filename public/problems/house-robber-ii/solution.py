from typing import List
class Solution:
    def rob(self, nums: List[int]) -> int:
        if len(nums) == 1:
            return nums[0]
        def linear(start, end):
            two_back = one_back = 0
            for i in range(start, end):
                # Each line follows the ordinary nonadjacent prefix recurrence.
                current = max(one_back, two_back + nums[i])
                two_back, one_back = one_back, current
            return one_back
        # Every legal circular selection excludes one of the endpoints.
        return max(linear(0, len(nums) - 1), linear(1, len(nums)))
