class Solution:
    def minSubArrayLen(self, target, nums):
        left, total = 0, 0
        best = len(nums) + 1
        for right, value in enumerate(nums):
            total += value
            # Every qualifying window may be shortened, so keep removing its left edge.
            while total >= target:
                best = min(best, right - left + 1)
                total -= nums[left]
                left += 1
        return 0 if best == len(nums) + 1 else best
