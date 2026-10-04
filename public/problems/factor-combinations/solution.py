class Solution:
    def getFactors(self, n: int) -> list[list[int]]:
        result, path = [], []
        def search(remaining, start):
            factor = start
            while factor * factor <= remaining:
                if remaining % factor == 0:
                    quotient = remaining // factor
                    # This pair completes one valid nondecreasing factorization.
                    result.append(path + [factor, quotient])
                    path.append(factor)
                    # Smaller factors would duplicate a permutation already explored.
                    search(quotient, factor)
                    path.pop()
                factor += 1
        search(n, 2)
        return result
