from typing import List
from heapq import heapify, heappop, heappush
class Solution:
    def kSmallestPairs(self, nums1: List[int], nums2: List[int], k: int) -> List[List[int]]:
        heap = [(nums1[i] + nums2[0], i, 0) for i in range(min(k, len(nums1)))]
        heapify(heap)
        result = []
        while heap and len(result) < k:
            total, i, j = heappop(heap)
            result.append([nums1[i], nums2[j]])
            # Replace this row's front with its next smallest pair.
            if j + 1 < len(nums2):
                heappush(heap, (nums1[i] + nums2[j + 1], i, j + 1))
        return result
