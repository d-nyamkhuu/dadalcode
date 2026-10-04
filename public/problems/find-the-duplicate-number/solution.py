from typing import List
class Solution:
    def findDuplicate(self, nums: List[int]) -> int:
        slow = fast = 0
        while True:
            # Two speeds guarantee a meeting inside the reachable cycle.
            slow = nums[slow]
            fast = nums[nums[fast]]
            if slow == fast:
                break
        finder = 0
        while finder != slow:
            # Equal speeds from these starts meet at the cycle entrance.
            finder = nums[finder]
            slow = nums[slow]
        return finder
