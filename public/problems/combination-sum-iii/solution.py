class Solution:
    def combinationSum3(self, k, n):
        path, result = [], []
        def visit(start, remaining):
            if len(path) == k:
                # Both requirements must hold at the same leaf.
                if remaining == 0:
                    result.append(path[:])
                return
            needed = k - len(path)
            # There must be enough distinct digits left to finish the selection.
            for value in range(start, 10 - needed + 1):
                if value > remaining:
                    break
                path.append(value)
                visit(value + 1, remaining - value)
                path.pop()
        visit(1, n)
        return result
