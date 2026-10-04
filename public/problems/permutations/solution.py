class Solution:
    def permute(self, nums):
        result, path, used = [], [], set()
        def visit():
            # A full prefix is one complete permutation.
            if len(path) == len(nums):
                result.append(path.copy())
                return
            for value in nums:
                # Each number can occupy only one position in this branch.
                if value in used:
                    continue
                used.add(value)
                path.append(value)
                visit()
                # Undo both pieces of state before the next sibling branch.
                path.pop()
                used.remove(value)
        visit()
        return result
