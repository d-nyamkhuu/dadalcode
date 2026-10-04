class Solution:
    def majorityElement(self, nums: list[int]) -> int:
        candidate, votes = None, 0
        for i, value in enumerate(nums):
            # Zero balance means earlier values have cancelled in unequal pairs.
            if votes == 0:
                candidate = value
            # A disagreement cancels one vote for the current candidate.
            votes += 1 if value == candidate else -1
        return candidate
