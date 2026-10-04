from collections import Counter

class Solution:
    def minWindow(self, s: str, t: str) -> str:
        needed = Counter(t)
        missing = len(t)
        left = best_start = 0
        best_length = len(s) + 1
        for right, ch in enumerate(s):
            # Only a still-needed copy reduces the total deficit.
            if needed[ch] > 0:
                missing -= 1
            needed[ch] -= 1
            while missing == 0:
                # The window is valid, so record it before shrinking.
                length = right - left + 1
                if length < best_length:
                    best_start, best_length = left, length
                leaving = s[left]
                needed[leaving] += 1
                # Releasing an essential copy ends this shrink phase.
                if needed[leaving] > 0:
                    missing += 1
                left += 1
        return '' if best_length > len(s) else s[best_start:best_start + best_length]
