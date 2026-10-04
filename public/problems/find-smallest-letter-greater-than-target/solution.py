from __future__ import annotations
from typing import List
class Solution:
    def nextGreatestLetter(self, letters: List[str], target: str) -> str:
        left, right = 0, len(letters)
        while left < right:
            mid = (left + right) // 2
            if letters[mid] <= target:
                # Equal letters are not valid; discard them together with smaller ones.
                left = mid + 1
            else:
                right = mid
        return letters[left % len(letters)]
