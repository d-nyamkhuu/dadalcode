class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        left = 0
        best = 0
        last = {}
        for right, ch in enumerate(s):
            # A duplicate inside the window forces its earlier copy out.
            if ch in last and last[ch] >= left:
                left = last[ch] + 1
            # Remember this occurrence for future duplicate checks.
            last[ch] = right
            # The current window is the longest distinct window ending here.
            best = max(best, right - left + 1)
        return best
