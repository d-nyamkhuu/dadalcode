class Solution:
    def maxPathSum(self, root: TreeNode) -> int:
        best = float('-inf')
        gains = {}
        stack = [(root, False)]
        while stack:
            node, processed = stack.pop()
            if node is None:
                continue
            # Defer this node until both children's downward gains are known.
            if not processed:
                stack.append((node, True))
                stack.append((node.right, False))
                stack.append((node.left, False))
                continue
            left_gain = max(0, gains.get(node.left, 0))
            right_gain = max(0, gains.get(node.right, 0))
            # A completed path can turn here and take both child branches.
            best = max(best, node.val + left_gain + right_gain)
            # A parent must receive a single branch, never a fork.
            gains[node] = node.val + max(left_gain, right_gain)
        return best
