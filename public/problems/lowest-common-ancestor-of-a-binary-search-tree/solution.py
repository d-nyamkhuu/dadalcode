class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        node = root
        while node is not None:
            # Both search paths continue left, so their lowest shared node is below.
            if p.val < node.val and q.val < node.val:
                node = node.left
            elif p.val > node.val and q.val > node.val:
                node = node.right
            else:
                # A split or a target itself is the first shared ancestor from below.
                return node
