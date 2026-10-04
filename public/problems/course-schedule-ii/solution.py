from __future__ import annotations
from typing import List
from collections import deque
class Solution:
    def findOrder(self, numCourses: int, prerequisites: List[List[int]]) -> List[int]:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, prerequisite in prerequisites:
            # Edges represent work unlocked by finishing a prerequisite.
            graph[prerequisite].append(course)
            indegree[course] += 1
        queue = deque(course for course in range(numCourses) if indegree[course] == 0)
        order = []
        while queue:
            course = queue.popleft()
            order.append(course)
            for dependent in graph[course]:
                indegree[dependent] -= 1
                if indegree[dependent] == 0:
                    # All prerequisites have now been emitted.
                    queue.append(dependent)
        return order if len(order) == numCourses else []
