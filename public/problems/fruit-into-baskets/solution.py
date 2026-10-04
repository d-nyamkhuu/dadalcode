from typing import List
class Solution:
    def totalFruit(self, fruits: List[int]) -> int:
        counts = {}
        left = best = 0
        for right, fruit in enumerate(fruits):
            counts[fruit] = counts.get(fruit, 0) + 1
            # A third type requires releasing fruit from the window's left.
            while len(counts) > 2:
                old = fruits[left]
                counts[old] -= 1
                if counts[old] == 0:
                    del counts[old]
                left += 1
            best = max(best, right - left + 1)
        return best
