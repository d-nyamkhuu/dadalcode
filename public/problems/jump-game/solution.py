class Solution:
    def canJump(self, nums: list[int]) -> bool:
        farthest = 0
        for i, jump in enumerate(nums):
            # A gap beyond all known jumps makes every later index unreachable.
            if i > farthest:
                return False
            farthest = max(farthest, i + jump)
            # Reaching or crossing the final index is already sufficient.
            if farthest >= len(nums) - 1:
                return True
        return False
