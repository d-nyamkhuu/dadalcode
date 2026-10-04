class Solution:
    def combine(self, n: int, k: int) -> list[list[int]]:
        path, result = [], []
        def visit(start):
            needed = k - len(path)
            if needed == 0:
                result.append(path[:])
                return
            # Stop early enough that the remaining suffix can still fill needed slots.
            for value in range(start, n - needed + 2):
                path.append(value)
                visit(value + 1)
                path.pop()
        visit(1)
        return result
