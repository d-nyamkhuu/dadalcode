from typing import Optional
class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        stack = [(root, float('-inf'), float('inf'))]
        while stack:
            node, low, high = stack.pop()
            if node is None:
                continue
            # Strict bounds include every ancestor's ordering constraint.
            if not low < node.val < high:
                return False
            stack.append((node.right, node.val, high))
            stack.append((node.left, low, node.val))
        return True
