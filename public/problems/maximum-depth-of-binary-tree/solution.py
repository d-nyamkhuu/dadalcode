class Solution:
    def maxDepth(self, root: TreeNode | None) -> int:
        stack = [(root, 1)] if root else []
        best = 0
        while stack:
            node, depth = stack.pop()
            # Each stack depth is exactly its node count from the root.
            best = max(best, depth)
            if node.left:
                stack.append((node.left, depth + 1))
            if node.right:
                stack.append((node.right, depth + 1))
        return best
