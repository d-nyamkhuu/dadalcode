from collections import deque

class Solution:
    def rightSideView(self, root: TreeNode | None) -> list[int]:
        if root is None:
            return []
        queue = deque([root])
        result = []
        while queue:
            level_size = len(queue)
            for index in range(level_size):
                node = queue.popleft()
                # The last left-to-right node is visible from the right.
                if index == level_size - 1:
                    result.append(node.val)
                if node.left is not None:
                    queue.append(node.left)
                if node.right is not None:
                    queue.append(node.right)
        return result
