from typing import List
class Interval:
    def __init__(self, start: int = 0, end: int = 0) -> None:
        self.start = start
        self.end = end
class Solution:
    def employeeFreeTime(self, schedule: List[List[Interval]]) -> List[Interval]:
        busy = sorted((interval.start, interval.end) for employee in schedule for interval in employee)
        result = []
        busy_end = busy[0][1]
        for i in range(1, len(busy)):
            start, end = busy[i]
            if start > busy_end:
                # Sorted starts prove nobody works inside this finite gap.
                result.append(Interval(busy_end, start))
            # Nested and overlapping work extends the union only to its maximum.
            busy_end = max(busy_end, end)
        return result
