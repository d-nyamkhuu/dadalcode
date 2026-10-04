class Solution:
    def constructMaximumBinaryTree(self, nums):
        stack = []
        for value in nums:
            node = TreeNode(value)
            # Smaller trailing roots belong in this new maximum's left subtree.
            while stack and stack[-1].val < value:
                node.left = stack.pop()
            if stack:
                # The remaining larger ancestor keeps this node on its right.
                stack[-1].right = node
            stack.append(node)
        return stack[0]
