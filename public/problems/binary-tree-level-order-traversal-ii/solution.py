from collections import deque

class Solution:
    def levelOrderBottom(self, root: TreeNode | None) -> list[list[int]]:
        if root is None:
            return []
        queue = deque([root])
        levels = []
        while queue:
            level = []
            level_size = len(queue)
            # Process only nodes that were present at this depth's start.
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                if node.left is not None:
                    queue.append(node.left)
                if node.right is not None:
                    queue.append(node.right)
            levels.append(level)
        # Reverse depth groups while preserving each group's left-to-right order.
        return levels[::-1]
