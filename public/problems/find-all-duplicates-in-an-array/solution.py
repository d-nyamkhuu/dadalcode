from typing import List
class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        result = []
        for i in range(len(nums)):
            # Earlier markers may have negated this cell, but not its magnitude.
            value = abs(nums[i])
            index = value - 1
            if nums[index] < 0:
                result.append(value)
            else:
                # The sign of the value-owned slot remembers the first visit.
                nums[index] = -nums[index]
        return result
