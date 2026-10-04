from __future__ import annotations
from typing import List
class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        merged = []
        for start, end in sorted(intervals):
            if merged and start <= merged[-1][1]:
                # Overlap extends one connected component of the union.
                merged[-1][1] = max(merged[-1][1], end)
            else:
                # No later-starting interval can reconnect an earlier closed component.
                merged.append([start, end])
        return merged
