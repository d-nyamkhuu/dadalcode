from collections import defaultdict
class Solution:
    def pathSum(self, root, targetSum: int) -> int:
        counts = defaultdict(int)
        counts[0] = 1
        stack = [(root, 0, False)] if root else []
        result = 0
        while stack:
            node, total, exiting = stack.pop()
            if exiting:
                # Remove this ancestor when its subtree is complete; siblings cannot use it.
                counts[total] -= 1
                if counts[total] == 0:
                    del counts[total]
                continue
            total += node.val
            # Every matching ancestor prefix gives a distinct downward path ending here.
            result += counts.get(total - targetSum, 0)
            counts[total] += 1
            stack.append((node, total, True))
            if node.right:
                stack.append((node.right, total, False))
            if node.left:
                stack.append((node.left, total, False))
        return result
