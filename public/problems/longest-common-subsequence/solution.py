class Solution:
    def longestCommonSubsequence(self, text1: str, text2: str) -> int:
        previous = [0] * (len(text2) + 1)
        for row, first in enumerate(text1, 1):
            current = [0] * (len(text2) + 1)
            for col, second in enumerate(text2, 1):
                if first == second:
                    # Equal last characters extend the shorter-prefix optimum.
                    current[col] = previous[col - 1] + 1
                else:
                    # Drop one final character and keep the better prefix result.
                    current[col] = max(previous[col], current[col - 1])
            previous = current
        return previous[-1]
