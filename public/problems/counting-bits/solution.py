class Solution:
    def countBits(self, n: int) -> list[int]:
        counts = [0] * (n + 1)
        for i in range(1, n + 1):
            # Reuse the prefix bits, then account for the newly removed final bit.
            counts[i] = counts[i >> 1] + (i & 1)
        return counts
