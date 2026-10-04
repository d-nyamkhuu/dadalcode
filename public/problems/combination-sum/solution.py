class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        candidates = sorted(candidates)
        result, path = [], []
        def visit(start, remaining):
            if remaining == 0:
                # Copy before backtracking changes the shared path.
                result.append(path[:])
                return
            for i in range(start, len(candidates)):
                value = candidates[i]
                # All later sorted candidates are also too large.
                if value > remaining:
                    break
                path.append(value)
                # Staying at i permits repeated use but prevents reordered duplicates.
                visit(i, remaining - value)
                path.pop()
        visit(0, target)
        return result
