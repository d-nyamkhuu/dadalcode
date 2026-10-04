class Solution:
    def invertTree(self, root: TreeNode | None) -> TreeNode | None:
        stack = [root] if root else []
        while stack:
            node = stack.pop()
            # Reflection exchanges child links at every node, not their values.
            node.left, node.right = node.right, node.left
            if node.left:
                stack.append(node.left)
            if node.right:
                stack.append(node.right)
        return root
