from __future__ import annotations
from typing import List
from collections import Counter
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        counts = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]
        for value, frequency in counts.items():
            # Bounded integer counts replace comparison sorting.
            buckets[frequency].append(value)
        result = []
        for frequency in range(len(nums), 0, -1):
            for value in buckets[frequency]:
                result.append(value)
                if len(result) == k:
                    # Descending frequencies ensure these are the requested leaders.
                    return result
