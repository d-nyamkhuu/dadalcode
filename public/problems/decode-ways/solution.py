from __future__ import annotations
class Solution:
    def numDecodings(self, s: str) -> int:
        dp = [0] * (len(s) + 1)
        dp[0] = 1
        for i in range(1, len(s) + 1):
            single = s[i - 1]
            if single != '0':
                # Append this valid one-digit letter to every shorter decoding.
                dp[i] += dp[i - 1]
            if i >= 2:
                pair = int(s[i - 2:i])
                if 10 <= pair <= 26:
                    # A two-digit ending is a disjoint family of decodings.
                    dp[i] += dp[i - 2]
        return dp[-1]
