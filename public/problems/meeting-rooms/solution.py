class Solution:
    def canAttendMeetings(self, intervals: list[list[int]]) -> bool:
        intervals = sorted(intervals)
        for i in range(1, len(intervals)):
            # Endpoints may touch; only a strictly earlier start creates overlap.
            if intervals[i][0] < intervals[i - 1][1]:
                return False
        return True
