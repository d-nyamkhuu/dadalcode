from __future__ import annotations
from typing import List
class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        last_end = float('-inf')
        kept = 0
        for start, end in sorted(intervals, key=lambda pair: pair[1]):
            if start >= last_end:
                # Earliest finish leaves maximal room for future compatible intervals.
                kept += 1
                last_end = end
        return len(intervals) - kept
