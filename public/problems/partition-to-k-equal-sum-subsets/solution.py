from typing import List
class Solution:
    def canPartitionKSubsets(self, nums: List[int], k: int) -> bool:
        total = sum(nums)
        if total % k:
            return False
        target = total // k
        if max(nums) > target:
            return False
        remainder = [-1] * (1 << len(nums))
        remainder[0] = 0
        for mask in range(len(remainder)):
            current = remainder[mask]
            if current < 0:
                continue
            for i, value in enumerate(nums):
                # Add an unused value only when it fits the current bucket.
                if mask & (1 << i) or current + value > target:
                    continue
                next_mask = mask | (1 << i)
                # Exactly filling target begins the next empty bucket.
                remainder[next_mask] = (current + value) % target
        return remainder[-1] == 0
