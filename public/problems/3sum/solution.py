from typing import List
class Solution:
    def threeSum(self, nums: List[int]) -> List[List[int]]:
        values = sorted(nums)
        result = []
        for i, anchor in enumerate(values):
            # Equal anchors would produce identical value triplets.
            if i and anchor == values[i - 1]:
                continue
            if anchor > 0:
                break
            left, right = i + 1, len(values) - 1
            while left < right:
                total = anchor + values[left] + values[right]
                # Sorted order tells us which side can improve the sum.
                if total < 0:
                    left += 1
                elif total > 0:
                    right -= 1
                else:
                    result.append([anchor, values[left], values[right]])
                    left += 1
                    right -= 1
                    # Skip all copies of the matched pair values.
                    while left < right and values[left] == values[left - 1]:
                        left += 1
                    while left < right and values[right] == values[right + 1]:
                        right -= 1
        return result
