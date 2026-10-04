class Solution:
    def findNumberOfLIS(self, nums: list[int]) -> int:
        length = [1] * len(nums)
        ways = [1] * len(nums)
        for i in range(len(nums)):
            for j in range(i):
                if nums[j] < nums[i]:
                    candidate = length[j] + 1
                    if candidate > length[i]:
                        # A better length replaces all previously shorter constructions.
                        length[i], ways[i] = candidate, ways[j]
                    elif candidate == length[i]:
                        # Different previous indices define disjoint optimal subsequences.
                        ways[i] += ways[j]
        longest = max(length)
        return sum(ways[i] for i in range(len(nums)) if length[i] == longest)
