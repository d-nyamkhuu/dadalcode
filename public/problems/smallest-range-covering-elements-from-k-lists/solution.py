from heapq import heappush, heappop

class Solution:
    def smallestRange(self, nums: list[list[int]]) -> list[int]:
        heap = []
        high = max(row[0] for row in nums)
        for row, values in enumerate(nums):
            heappush(heap, (values[0], row, 0))
        best = [heap[0][0], high]
        while heap:
            low, row, index = heappop(heap)
            # Compare width first, then the left endpoint on ties.
            if (high - low, low) < (best[1] - best[0], best[0]):
                best = [low, high]
            if index + 1 == len(nums[row]):
                # This list can no longer supply coverage for later ranges.
                break
            value = nums[row][index + 1]
            high = max(high, value)
            heappush(heap, (value, row, index + 1))
        return best
