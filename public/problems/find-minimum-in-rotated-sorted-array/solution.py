class Solution:
    def findMin(self, nums: list[int]) -> int:
        left, right = 0, len(nums) - 1
        while left < right:
            mid = (left + right) // 2
            # The larger middle belongs to the high segment before the rotation break.
            if nums[mid] > nums[right]:
                left = mid + 1
            else:
                # The middle may itself be the minimum, so retain it.
                right = mid
        return nums[left]
