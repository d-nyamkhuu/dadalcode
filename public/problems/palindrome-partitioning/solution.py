from typing import List
class Solution:
    def partition(self, s: str) -> List[List[str]]:
        n = len(s)
        palindrome = [[False] * n for _ in range(n)]
        for length in range(1, n + 1):
            for left in range(n - length + 1):
                right = left + length - 1
                # Short ranges need only endpoint equality; longer ones need a valid interior.
                palindrome[left][right] = s[left] == s[right] and (length <= 2 or palindrome[left + 1][right - 1])
        result, path = [], []
        def search(start):
            if start == n:
                result.append(path.copy())
                return
            for end in range(start, n):
                if palindrome[start][end]:
                    # Choosing one valid piece leaves the same problem on its suffix.
                    path.append(s[start:end + 1])
                    search(end + 1)
                    path.pop()
        search(0)
        return result
