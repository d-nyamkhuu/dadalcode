from collections import deque
class Solution:
    def cloneGraph(self, node):
        if node is None:
            return None
        copies = {node: Node(node.val)}
        queue = deque([node])
        while queue:
            current = queue.popleft()
            for neighbor in current.neighbors:
                if neighbor not in copies:
                    # Memoize immediately so cycles reuse the same cloned identity.
                    copies[neighbor] = Node(neighbor.val)
                    queue.append(neighbor)
                # Every original edge becomes an edge between two new objects.
                copies[current].neighbors.append(copies[neighbor])
        return copies[node]
