class Solution:
    def permuteUnique(self, nums: list[int]) -> list[list[int]]:
        nums = sorted(nums)
        used = [False] * len(nums)
        path, result = [], []
        def visit():
            if len(path) == len(nums):
                result.append(path[:])
                return
            for i in range(len(nums)):
                if used[i]:
                    continue
                # Equal occurrences must be selected in their canonical index order.
                if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                    continue
                used[i] = True
                path.append(nums[i])
                visit()
                # Restore this depth before trying a different next value.
                path.pop()
                used[i] = False
        visit()
        return result
