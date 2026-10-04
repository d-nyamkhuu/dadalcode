class Solution:
    def pathSum(self, root: TreeNode | None, targetSum: int) -> list[list[int]]:
        result = []
        stack = [(root, [], 0)] if root else []
        while stack:
            node, prefix, total = stack.pop()
            path = prefix + [node.val]
            total += node.val
            # Only complete root-to-leaf paths satisfy the problem contract.
            if not node.left and not node.right and total == targetSum:
                result.append(path)
            if node.right:
                stack.append((node.right, path, total))
            if node.left:
                stack.append((node.left, path, total))
        return result
