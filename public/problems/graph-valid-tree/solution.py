class Solution:
    def validTree(self, n: int, edges) -> bool:
        # A tree must have exactly one fewer edge than vertices.
        if len(edges) != n - 1:
            return False
        adjacency = [[] for _ in range(n)]
        for a, b in edges:
            adjacency[a].append(b)
            adjacency[b].append(a)
        visited = {0}
        stack = [0]
        while stack:
            node = stack.pop()
            for neighbor in adjacency[node]:
                # Mark before pushing so each vertex enters the stack once.
                if neighbor not in visited:
                    visited.add(neighbor)
                    stack.append(neighbor)
        # With n-1 edges, connectivity also rules out every cycle.
        return len(visited) == n
