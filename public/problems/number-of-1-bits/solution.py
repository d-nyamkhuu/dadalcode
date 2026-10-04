from __future__ import annotations
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            # Keep the pre-clearing value so the bit visualization can compare both states.
            previous = n
            # n-1 flips the lowest set bit and lower bits; AND removes exactly that bit.
            n &= n - 1
            count += 1
        return count
