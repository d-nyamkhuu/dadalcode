class Solution:
    def canPartition(self, nums: list[int]) -> bool:
        total = sum(nums)
        if total % 2:
            return False
        target = total // 2
        reachable = [False] * (target + 1)
        reachable[0] = True
        for value in nums:
            # Descending order reads states from before this value was included.
            for subtotal in range(target, value - 1, -1):
                reachable[subtotal] = reachable[subtotal] or reachable[subtotal - value]
            # An existing half-sum subset stays usable when later values are excluded.
            if reachable[target]:
                return True
        return reachable[target]
