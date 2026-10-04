from collections import Counter, deque
from heapq import heapify, heappop, heappush
class Solution:
    def rearrangeString(self, s: str, k: int) -> str:
        if k <= 1:
            return s
        counts = Counter(s)
        heap = [(-count, letter) for letter, count in counts.items()]
        heapify(heap)
        cooldown, result = deque(), []
        for position in range(len(s)):
            # A character becomes legal exactly k indices after its previous use.
            while cooldown and cooldown[0][0] <= position:
                ready, count, letter = cooldown.popleft()
                heappush(heap, (count, letter))
            if not heap:
                return ''
            # Prioritize the character with the most future occurrences to place.
            count, letter = heappop(heap)
            result.append(letter)
            if count + 1 < 0:
                cooldown.append((position + k, count + 1, letter))
        return ''.join(result)
