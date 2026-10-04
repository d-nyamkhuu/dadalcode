from __future__ import annotations
class Solution:
    def isSubtree(self, root: TreeNode, subRoot: TreeNode) -> bool:
        def identical(first, second):
            pairs = [(first, second)]
            while pairs:
                first, second = pairs.pop()
                if first is None or second is None:
                    if first is not second:
                        # Exactly one missing node means the shapes differ.
                        return False
                    continue
                if first.val != second.val:
                    return False
                pairs.append((first.left, second.left))
                pairs.append((first.right, second.right))
            return True
        stack = [root]
        while stack:
            node = stack.pop()
            if node.val == subRoot.val and identical(node, subRoot):
                return True
            # A failed candidate does not eliminate candidates below it.
            if node.right:
                stack.append(node.right)
            if node.left:
                stack.append(node.left)
        return False
