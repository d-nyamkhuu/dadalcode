class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        seen = {}
        for i, value in enumerate(nums):
            # The missing value must have appeared at an earlier, distinct index.
            complement = target - value
            if complement in seen:
                return [seen[complement], i]
            # Only now make this element available to future elements.
            seen[value] = i
        return []
