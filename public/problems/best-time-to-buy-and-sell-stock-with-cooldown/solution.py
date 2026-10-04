from typing import List
class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        hold = sold = float('-inf')
        rest = 0
        for day, price in enumerate(prices):
            # Only yesterday's ready state is allowed to buy today.
            next_hold = max(hold, rest - price)
            next_sold = hold + price
            # A sale yesterday becomes ready only after resting today.
            next_rest = max(rest, sold)
            hold, sold, rest = next_hold, next_sold, next_rest
        return max(sold, rest)
