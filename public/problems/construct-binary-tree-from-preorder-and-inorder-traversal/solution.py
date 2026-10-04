from typing import List, Optional
class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        root = TreeNode(preorder[0])
        stack = [root]
        i = 0
        for pre_index in range(1, len(preorder)):
            value = preorder[pre_index]
            node = stack[-1]
            child = TreeNode(value)
            if node.val != inorder[i]:
                # Inorder has not reached this root, so its left side comes next.
                node.left = child
            else:
                # Pop completed roots until the next right subtree is located.
                # With another preorder node pending, valid traversals cannot finish all inorder entries here.
                while stack and stack[-1].val == inorder[i]:
                    node = stack.pop()
                    i += 1
                node.right = child
            stack.append(child)
        return root
