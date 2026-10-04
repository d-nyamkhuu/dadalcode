from typing import List
from collections import deque
class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        for course, prerequisite in prerequisites:
            graph[prerequisite].append(course)
            indegree[course] += 1
        ready = deque(i for i in range(numCourses) if indegree[i] == 0)
        completed = 0
        while ready:
            course = ready.popleft()
            completed += 1
            for dependent in graph[course]:
                # Completing this course fulfills one incoming requirement.
                indegree[dependent] -= 1
                if indegree[dependent] == 0:
                    ready.append(dependent)
        return completed == numCourses
