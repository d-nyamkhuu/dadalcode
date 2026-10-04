class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        def previous(text, index):
            skip = 0
            while index >= 0:
                if text[index] == '#':
                    # A backspace creates one pending deletion of an earlier letter.
                    skip += 1
                elif skip:
                    # This earlier letter consumes one pending deletion instead of surviving.
                    skip -= 1
                else:
                    # This character survives every backspace to its right.
                    break
                index -= 1
            return index
        i, j = len(s) - 1, len(t) - 1
        while i >= 0 or j >= 0:
            i = previous(s, i)
            j = previous(t, j)
            if i < 0 or j < 0:
                return i == j
            if s[i] != t[j]:
                return False
            i -= 1
            j -= 1
        return True
