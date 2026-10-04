from heapq import heappush, heappop

class MedianFinder:
    def __init__(self):
        self.lower = []
        self.upper = []

    def addNum(self, num: int) -> None:
        lower, upper = self.lower, self.upper
        heappush(lower, -num)
        # Transfer the largest lower value to maintain ordering between halves.
        heappush(upper, -heappop(lower))
        # Lower is allowed to own the extra element, upper is not.
        if len(upper) > len(lower):
            heappush(lower, -heappop(upper))

    def findMedian(self) -> float:
        lower, upper = self.lower, self.upper
        if len(lower) == len(upper):
            return (-lower[0] + upper[0]) / 2
        return float(-lower[0])
