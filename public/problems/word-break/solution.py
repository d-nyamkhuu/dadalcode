class Solution:
    def wordBreak(self, s: str, wordDict: list[str]) -> bool:
        words = set(wordDict)
        longest = max(map(len, words))
        dp = [False] * (len(s) + 1)
        dp[0] = True
        for end in range(1, len(s) + 1):
            for start in range(max(0, end - longest), end):
                # Append exactly one dictionary word to a reachable prefix.
                if dp[start] and s[start:end] in words:
                    dp[end] = True
                    break
        return dp[-1]
