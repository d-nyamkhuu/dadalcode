from collections import deque
class Solution:
    def distanceK(self, root, target, k):
        parents = {root: None}
        stack = [root]
        while stack:
            node = stack.pop()
            for child in (node.left, node.right):
                if child is not None:
                    parents[child] = node
                    stack.append(child)
        queue = deque([(target, 0)])
        seen, result = {target}, []
        while queue:
            node, distance = queue.popleft()
            # BFS distance is shortest; this frontier is the requested answer.
            if distance == k:
                result.append(node.val)
                continue
            for neighbor in (node.left, node.right, parents[node]):
                if neighbor is not None and neighbor not in seen:
                    # Undirected edges need visitation marks to avoid cycling back.
                    seen.add(neighbor)
                    queue.append((neighbor, distance + 1))
        return result
