class Solution:
    def maxProduct(self, nums: list[int]) -> int:
        high = low = best = nums[0]
        for i in range(1, len(nums)):
            value = nums[i]
            old_high, old_low = high, low
            # A negative multiplier swaps the roles of previous extremes.
            high = max(value, value * old_high, value * old_low)
            low = min(value, value * old_high, value * old_low)
            # Every candidate here is a nonempty subarray ending at i.
            best = max(best, high)
        return best
