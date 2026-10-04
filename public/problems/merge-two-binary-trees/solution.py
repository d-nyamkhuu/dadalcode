class Solution:
    def mergeTrees(self, root1: TreeNode | None, root2: TreeNode | None) -> TreeNode | None:
        if not root1:
            return root2
        if not root2:
            return root1
        stack = [(root1, root2)]
        while stack:
            first, second = stack.pop()
            first.val += second.val
            # One-sided subtrees are already finished; only overlaps need more work.
            for direction in ('left', 'right'):
                a, b = getattr(first, direction), getattr(second, direction)
                if a is None:
                    setattr(first, direction, b)
                elif b is not None:
                    stack.append((a, b))
        return root1
