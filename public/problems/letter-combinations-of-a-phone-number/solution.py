class Solution:
    def letterCombinations(self, digits):
        if not digits:
            return []
        letters = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
        result = []
        def visit(i, path):
            # A complete path contains exactly one valid letter per digit.
            if i == len(digits):
                result.append(path)
                return
            for letter in letters[digits[i]]:
                # Explore every choice for this digit while preserving the prefix.
                visit(i + 1, path + letter)
        visit(0, '')
        return result
