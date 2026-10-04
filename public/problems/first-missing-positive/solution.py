class Solution:
    def firstMissingPositive(self, nums: list[int]) -> int:
        n = len(nums)
        for i in range(n):
            # Each valid value belongs in its own index; duplicates must stop swapping.
            while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:
                home = nums[i] - 1
                nums[i], nums[home] = nums[home], nums[i]
        for i, value in enumerate(nums):
            # The first incorrect home corresponds to the smallest missing positive.
            if value != i + 1:
                return i + 1
        return n + 1
