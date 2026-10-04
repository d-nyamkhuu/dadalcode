from collections import Counter
from heapq import heapify, heappop, heappush

class Solution:
    def reorganizeString(self, s: str) -> str:
        counts = Counter(s)
        # One letter needs a different separator between each pair of copies.
        if max(counts.values()) > (len(s) + 1) // 2:
            return ''
        heap = [(-count, ch) for ch, count in counts.items()]
        heapify(heap)
        result = []
        held = (0, '')
        while heap:
            count, ch = heappop(heap)
            result.append(ch)
            # The previous letter becomes eligible only after another is used.
            if held[0] < 0:
                heappush(heap, held)
            held = (count + 1, ch)
        return ''.join(result) if held[0] == 0 else ''
