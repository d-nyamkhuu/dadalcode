class Solution:
    def productExceptSelf(self, nums: list[int]) -> list[int]:
        result = [1] * len(nums)
        prefix = 1
        for i, value in enumerate(nums):
            # Store only the values strictly before this index.
            result[i] = prefix
            prefix *= value
        suffix = 1
        for i in range(len(nums)-1, -1, -1):
            # Combine disjoint left and right products while excluding nums[i].
            result[i] *= suffix
            suffix *= nums[i]
        return result
