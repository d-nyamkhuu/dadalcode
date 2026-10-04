from __future__ import annotations
class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        matched = 0
        for i, char in enumerate(t):
            if matched < len(s) and s[matched] == char:
                # This earliest available match preserves the largest remaining suffix.
                matched += 1
        return matched == len(s)
