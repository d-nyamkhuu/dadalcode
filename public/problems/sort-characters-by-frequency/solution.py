from collections import Counter
class Solution:
    def frequencySort(self, s: str) -> str:
        counts = Counter(s)
        # The tie-breaker stabilizes the walkthrough while preserving all valid ties.
        order = sorted(counts, key=lambda char: (-counts[char], char))
        groups = []
        for char in order:
            # Emit an entire frequency block so equal characters stay contiguous.
            groups.append(char * counts[char])
        return ''.join(groups)
