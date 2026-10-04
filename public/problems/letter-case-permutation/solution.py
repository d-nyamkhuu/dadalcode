from typing import List
class Solution:
    def letterCasePermutation(self, s: str) -> List[str]:
        result, path = [], []
        def search(i):
            if i == len(s):
                result.append(''.join(path))
                return
            char = s[i]
            # Digits have one choice; English letters have exactly two.
            choices = (char.lower(), char.upper()) if char.isalpha() else (char,)
            for choice in choices:
                path.append(choice)
                search(i + 1)
                path.pop()
        search(0)
        return result
