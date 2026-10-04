class Solution:
    def findTargetSumWays(self, nums: list[int], target: int) -> int:
        total_sum = sum(nums)
        # Signed sums stay inside this range and share total_sum's parity.
        if abs(target) > total_sum or (total_sum - target) % 2:
            return 0
        ways = {0: 1}
        for value in nums:
            next_ways = {}
            for total, count in ways.items():
                # Each previous assignment has two distinct sign extensions.
                plus, minus = total + value, total - value
                next_ways[plus] = next_ways.get(plus, 0) + count
                next_ways[minus] = next_ways.get(minus, 0) + count
            # Never update the same map while processing a number.
            ways = next_ways
        return ways.get(target, 0)
