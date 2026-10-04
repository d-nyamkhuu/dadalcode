class Solution:
    def combinationSum4(self, nums, target: int) -> int:
        dp = [0] * (target + 1)
        dp[0] = 1
        for total in range(1, target + 1):
            for value in nums:
                # Append this final value to every smaller ordered sequence.
                if value <= total:
                    dp[total] += dp[total - value]
        return dp[target]
