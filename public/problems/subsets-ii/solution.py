class Solution:
    def subsetsWithDup(self, nums):
        nums = sorted(nums)
        result, path = [], []
        def visit(start):
            # Every partial selection is itself a valid subset.
            result.append(path[:])
            for i in range(start, len(nums)):
                # Skip duplicate siblings but allow equal values at deeper levels.
                if i > start and nums[i] == nums[i - 1]:
                    continue
                path.append(nums[i])
                visit(i + 1)
                path.pop()
        visit(0)
        return result
