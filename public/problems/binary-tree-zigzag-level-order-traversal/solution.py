from __future__ import annotations
from typing import List
from collections import deque
class Solution:
    def zigzagLevelOrder(self, root: TreeNode) -> List[List[int]]:
        if root is None:
            return []
        queue = deque([root])
        result = []
        left_to_right = True
        while queue:
            level = []
            for _ in range(len(queue)):
                # Consume only nodes that belonged to this level initially.
                node = queue.popleft()
                level.append(node.val)
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            if not left_to_right:
                # Display direction changes without changing BFS child ordering.
                level.reverse()
            result.append(level)
            left_to_right = not left_to_right
        return result
