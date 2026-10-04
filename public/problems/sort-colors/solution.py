from typing import List
class Solution:
    def sortColors(self, nums: List[int]) -> None:
        low = mid = 0
        high = len(nums) - 1
        while mid <= high:
            if nums[mid] == 0:
                # Put zero in its final region; the exchanged one is safe.
                nums[low], nums[mid] = nums[mid], nums[low]
                low += 1
                mid += 1
            elif nums[mid] == 1:
                mid += 1
            else:
                # The incoming value is still unknown, so mid stays put.
                nums[mid], nums[high] = nums[high], nums[mid]
                high -= 1
