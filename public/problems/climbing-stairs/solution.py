class Solution:
    def climbStairs(self, n: int) -> int:
        dp = [0] * (n + 1)
        # One empty route and one single-step route seed the recurrence.
        dp[0], dp[1] = 1, 1
        for i in range(2, n + 1):
            # Final moves come from disjoint predecessor stairs, so add their counts.
            dp[i] = dp[i - 1] + dp[i - 2]
        return dp[n]
