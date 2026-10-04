from collections import deque
class Solution:
    def averageOfLevels(self, root):
        queue, averages = deque([root]), []
        while queue:
            size, total = len(queue), 0
            for i in range(size):
                node = queue.popleft()
                total += node.val
                if node.left is not None:
                    queue.append(node.left)
                if node.right is not None:
                    queue.append(node.right)
            # The frozen denominator excludes children waiting for the next level.
            averages.append(total / size)
        return averages
