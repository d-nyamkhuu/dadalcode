from typing import List
class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        result = []
        path = []
        def visit(opened, closed):
            if closed == n:
                result.append(''.join(path))
                return
            # We may open a new pair until the opening budget is used.
            if opened < n:
                path.append('(')
                visit(opened + 1, closed)
                path.pop()
            # A closing parenthesis must match an existing open one.
            if closed < opened:
                path.append(')')
                visit(opened, closed + 1)
                path.pop()
        visit(0, 0)
        return result
