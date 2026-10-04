class Solution:
    def canCompleteCircuit(self, gas: list[int], cost: list[int]) -> int:
        start, tank, total = 0, 0, 0
        for i in range(len(gas)):
            balance = gas[i] - cost[i]
            total += balance
            tank += balance
            # Every start in this failed segment is impossible, so skip them together.
            if tank < 0:
                start = i + 1
                tank = 0
        # Total supply is the final feasibility test for the circular route.
        return start if total >= 0 else -1
