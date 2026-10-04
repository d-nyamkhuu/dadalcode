from __future__ import annotations
class Solution:
    def longestPalindrome(self, s: str) -> str:
        best_start, best_length = 0, 1
        for center in range(len(s)):
            for offset in (0, 1):
                left, right = center, center + offset
                # Equal symmetric characters preserve the palindrome invariant.
                while left >= 0 and right < len(s) and s[left] == s[right]:
                    left -= 1
                    right += 1
                # The pointers stopped just outside the valid interval.
                length = right - left - 1
                if length > best_length:
                    best_start, best_length = left + 1, length
        return s[best_start:best_start + best_length]
