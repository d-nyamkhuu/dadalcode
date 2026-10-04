from heapq import heappush, heapreplace

class Solution:
    def findKthLargest(self, nums: list[int], k: int) -> int:
        heap = []
        for value in nums:
            # Until full, every observed item belongs to the top-k group.
            if len(heap) < k:
                heappush(heap, value)
            elif value > heap[0]:
                # Replace the weakest member only with a stronger candidate.
                heapreplace(heap, value)
        return heap[0]
