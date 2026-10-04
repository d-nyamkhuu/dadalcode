from typing import List
from collections import Counter
class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        counts = Counter(tasks)
        maximum = max(counts.values())
        # Every tied maximum label contributes to the final partial frame.
        tied = sum(count == maximum for count in counts.values())
        frame = (maximum - 1) * (n + 1) + tied
        # Diverse tasks fill cooldown gaps; shortages become idle intervals.
        return max(len(tasks), frame)
