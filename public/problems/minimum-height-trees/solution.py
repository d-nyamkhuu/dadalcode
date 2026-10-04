from collections import deque

class Solution:
    def findMinHeightTrees(self, n: int, edges: list[list[int]]) -> list[int]:
        if n == 1:
            return [0]
        adjacency = [[] for _ in range(n)]
        degree = [0] * n
        for a, b in edges:
            adjacency[a].append(b)
            adjacency[b].append(a)
            degree[a] += 1
            degree[b] += 1
        leaves = deque(i for i in range(n) if degree[i] == 1)
        remaining = n
        while remaining > 2:
            layer_size = len(leaves)
            remaining -= layer_size
            # Trim the entire outside layer at once to preserve symmetry.
            for _ in range(layer_size):
                node = leaves.popleft()
                degree[node] = 0
                for neighbor in adjacency[node]:
                    if degree[neighbor] > 0:
                        degree[neighbor] -= 1
                        if degree[neighbor] == 1:
                            leaves.append(neighbor)
        return list(leaves)
