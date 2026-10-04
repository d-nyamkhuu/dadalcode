class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        values = set(nums)
        best = 0
        for value in values:
            # Only a run's smallest value may start a walk.
            if value - 1 in values:
                continue
            current = value
            while current in values:
                current += 1
            length = current - value
            best = max(best, length)
        return best
