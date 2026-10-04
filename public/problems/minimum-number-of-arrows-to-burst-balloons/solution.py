from typing import List
class Solution:
    def findMinArrowShots(self, points: List[List[int]]) -> int:
        arrow = None
        arrows = 0
        for start, end in sorted(points, key=lambda pair: pair[1]):
            if arrow is None or start > arrow:
                # Move the necessary next shot as far right as the first-ending balloon permits.
                arrow = end
                arrows += 1
        return arrows
