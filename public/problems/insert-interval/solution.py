class Solution:
    def insert(self, intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:
        start, end = newInterval
        result, i = [], 0
        # Strictly earlier intervals cannot overlap the inserted range.
        while i < len(intervals) and intervals[i][1] < start:
            result.append(intervals[i][:])
            i += 1
        # Merge the contiguous overlap block while maintaining its union bounds.
        while i < len(intervals) and intervals[i][0] <= end:
            start = min(start, intervals[i][0])
            end = max(end, intervals[i][1])
            i += 1
        result.append([start, end])
        while i < len(intervals):
            result.append(intervals[i][:])
            i += 1
        return result
