from __future__ import annotations
from typing import List
class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        unreachable = amount + 1
        dp = [unreachable] * (amount + 1)
        dp[0] = 0
        for value in range(1, amount + 1):
            for coin in coins:
                if coin <= value:
                    # Every composition can be classified by its final coin.
                    candidate = dp[value - coin] + 1
                    dp[value] = min(dp[value], candidate)
        return -1 if dp[amount] == unreachable else dp[amount]
