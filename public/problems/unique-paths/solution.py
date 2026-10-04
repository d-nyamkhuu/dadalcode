class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        # Keep the smaller dimension as the retained DP row.
        if n > m:
            m, n = n, m
        dp = [1] * n
        for row in range(1, m):
            for col in range(1, n):
                # Old dp[col] is above; updated dp[col - 1] is left.
                dp[col] += dp[col - 1]
        return dp[-1]
