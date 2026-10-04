class Solution:
    def isSameTree(self, p, q) -> bool:
        stack = [(p, q)]
        while stack:
            a, b = stack.pop()
            # An empty position matches only another empty position.
            if a is None or b is None:
                if a is not b:
                    return False
                continue
            # A value mismatch cannot be fixed by descendants.
            if a.val != b.val:
                return False
            # Pair matching child positions, preserving the tree's shape.
            stack.append((a.left, b.left))
            stack.append((a.right, b.right))
        return True
