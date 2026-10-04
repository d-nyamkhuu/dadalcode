from typing import List
from collections import Counter
from heapq import heappush, heappop
class Solution:
    def medianSlidingWindow(self, nums: List[int], k: int) -> List[float]:
        small, large = [], []
        delayed = Counter()
        small_size = large_size = 0
        def prune(heap):
            while heap:
                value = -heap[0] if heap is small else heap[0]
                if delayed[value] == 0:
                    break
                # Physically discard a value already removed from logical size.
                heappop(heap)
                delayed[value] -= 1
                if delayed[value] == 0:
                    del delayed[value]
        def balance():
            nonlocal small_size, large_size
            if small_size > large_size + 1:
                heappush(large, -heappop(small))
                small_size -= 1
                large_size += 1
                prune(small)
            elif small_size < large_size:
                heappush(small, -heappop(large))
                small_size += 1
                large_size -= 1
                prune(large)
        def add(value):
            nonlocal small_size, large_size
            # Partition around the largest active value in the lower half.
            if not small or value <= -small[0]:
                heappush(small, -value)
                small_size += 1
            else:
                heappush(large, value)
                large_size += 1
            balance()
        def remove(value):
            nonlocal small_size, large_size
            delayed[value] += 1
            if value <= -small[0]:
                small_size -= 1
                if value == -small[0]:
                    prune(small)
            else:
                large_size -= 1
                if large and value == large[0]:
                    prune(large)
            balance()
        result = []
        for i, value in enumerate(nums):
            add(value)
            if i >= k:
                remove(nums[i-k])
            if i >= k-1:
                # Active heap roots are the window's middle ordered values.
                median = float(-small[0]) if k % 2 else (-small[0] + large[0]) / 2.0
                result.append(median)
        return result
