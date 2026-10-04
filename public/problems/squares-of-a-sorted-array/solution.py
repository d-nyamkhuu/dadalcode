class Solution:
    def sortedSquares(self, nums):
        left, right = 0, len(nums) - 1
        result = [0] * len(nums)
        for write in range(len(nums) - 1, -1, -1):
            a, b = nums[left] ** 2, nums[right] ** 2
            # The largest absolute value is always at a remaining endpoint.
            if a > b:
                result[write] = a
                left += 1
            else:
                result[write] = b
                right -= 1
        return result
