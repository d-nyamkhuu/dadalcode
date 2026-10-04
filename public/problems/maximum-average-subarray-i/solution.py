class Solution:
    def findMaxAverage(self, nums: list[int], k: int) -> float:
        total = 0
        for i in range(k):
            total += nums[i]
        best = total
        for right in range(k, len(nums)):
            # Adjacent fixed-size windows differ by just one entering and one leaving value.
            total += nums[right] - nums[right - k]
            best = max(best, total)
        return best / k
