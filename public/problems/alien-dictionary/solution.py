from __future__ import annotations
from typing import List
from collections import deque
class Solution:
    def alienOrder(self, words: List[str]) -> str:
        graph = {char: set() for word in words for char in word}
        indegree = {char: 0 for char in graph}
        for first, second in zip(words, words[1:]):
            if len(first) > len(second) and first.startswith(second):
                # A shorter prefix must come first in every alphabet.
                return ''
            for a, b in zip(first, second):
                if a != b:
                    # Only the first mismatch decides word ordering.
                    if b not in graph[a]:
                        graph[a].add(b)
                        indegree[b] += 1
                    break
        queue = deque(char for char in graph if indegree[char] == 0)
        order = []
        while queue:
            # No remaining prerequisite prevents this character from being next.
            char = queue.popleft()
            order.append(char)
            # Sorted neighbors make traversal reproducible; the alphabet has at most 26 letters.
            for neighbor in sorted(graph[char]):
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        # Missing vertices imply a directed cycle.
        return ''.join(order) if len(order) == len(graph) else ''
