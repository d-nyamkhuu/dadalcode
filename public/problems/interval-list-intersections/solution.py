from typing import List
class Solution:
    def intervalIntersection(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        i = j = 0
        result = []
        while i < len(firstList) and j < len(secondList):
            low = max(firstList[i][0], secondList[j][0])
            high = min(firstList[i][1], secondList[j][1])
            if low <= high:
                # Both closed intervals contain every point in this common range.
                result.append([low, high])
            if firstList[i][1] < secondList[j][1]:
                # This interval cannot intersect any later interval on the other side.
                i += 1
            else:
                j += 1
        return result
