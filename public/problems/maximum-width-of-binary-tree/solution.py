from __future__ import annotations
from collections import deque
class Solution:
    def widthOfBinaryTree(self, root: TreeNode) -> int:
        queue = deque([(root, 0)])
        best = 0
        while queue:
            offset = queue[0][1]
            width = 0
            for _ in range(len(queue)):
                node, position = queue.popleft()
                # A common translation retains all spacing within this level.
                position -= offset
                width = position + 1
                if node.left:
                    queue.append((node.left, 2 * position))
                if node.right:
                    queue.append((node.right, 2 * position + 1))
            best = max(best, width)
        return best
