class Solution:
    def missingNumber(self, nums):
        missing = len(nums)
        for i, value in enumerate(nums):
            # Each expected index cancels the same present value regardless of order.
            missing ^= i ^ value
        return missing
