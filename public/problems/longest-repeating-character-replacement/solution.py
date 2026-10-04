class Solution:
    def characterReplacement(self, s: str, k: int) -> int:
        counts = {}
        left = best = 0
        for right, ch in enumerate(s):
            counts[ch] = counts.get(ch, 0) + 1
            # Keep the exact majority count so every traced window is valid.
            while right - left + 1 - max(counts.values()) > k:
                counts[s[left]] -= 1
                left += 1
            best = max(best, right - left + 1)
        return best
