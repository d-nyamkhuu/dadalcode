class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        matches = {')':'(', ']':'[', '}':'{'}
        for char in s:
            if char not in matches:
                stack.append(char)
            else:
                expected = matches[char]
                # Only the most recent unmatched opener may close now.
                if not stack or stack[-1] != expected:
                    return False
                stack.pop()
        return not stack
