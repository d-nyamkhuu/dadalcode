from __future__ import annotations
class Solution:
    def lowestCommonAncestor(self, root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
        parents = {root: None}
        stack = [root]
        while p not in parents or q not in parents:
            node = stack.pop()
            for child in (node.left, node.right):
                if child is not None:
                    # Record identity-based parent links without relying on value order.
                    parents[child] = node
                    stack.append(child)
        ancestors = set()
        current = p
        while current is not None:
            ancestors.add(current)
            current = parents[current]
        current = q
        while current not in ancestors:
            # The first shared ancestor encountered from q is the lowest one.
            current = parents[current]
        return current
