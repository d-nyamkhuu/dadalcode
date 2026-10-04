from typing import List, Optional
class Solution:
    def binaryTreePaths(self, root: Optional[TreeNode]) -> List[str]:
        path = []
        result = []
        def visit(node):
            path.append(str(node.val))
            if not node.left and not node.right:
                # Only a leaf completes a root-to-leaf path.
                result.append('->'.join(path))
            else:
                if node.left:
                    visit(node.left)
                if node.right:
                    visit(node.right)
            # Restore the parent's path before exploring a sibling.
            path.pop()
        if root:
            visit(root)
        return result
