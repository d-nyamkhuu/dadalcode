from typing import List
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        cheapest = prices[0]
        profit = 0
        for day in range(1, len(prices)):
            price = prices[day]
            # Sell today against the best purchase strictly before today.
            profit = max(profit, price - cheapest)
            cheapest = min(cheapest, price)
        return profit
