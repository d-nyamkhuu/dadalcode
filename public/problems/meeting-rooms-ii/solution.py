from typing import List
from heapq import heappush, heappop
class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        active_ends = []
        peak = 0
        for start, end in sorted(intervals):
            # Free every room whose meeting ended before this start.
            while active_ends and active_ends[0] <= start:
                heappop(active_ends)
            # This meeting now occupies one active room.
            heappush(active_ends, end)
            peak = max(peak, len(active_ends))
        return peak
