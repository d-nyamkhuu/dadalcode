class Solution:
    def countComponents(self, n: int, edges: list[list[int]]) -> int:
        graph = [[] for _ in range(n)]
        for a, b in edges:
            graph[a].append(b)
            graph[b].append(a)
        seen, components = set(), 0
        for start in range(n):
            if start in seen:
                continue
            # This vertex belongs to a component not reached by any earlier traversal.
            components += 1
            seen.add(start)
            stack = [start]
            while stack:
                node = stack.pop()
                for neighbor in graph[node]:
                    if neighbor not in seen:
                        # Mark at discovery to avoid duplicate work through cycles.
                        seen.add(neighbor)
                        stack.append(neighbor)
        return components
