class Solution:
    def generateAbbreviations(self, word):
        result = []
        def visit(i, path, count):
            if i == len(word):
                # A pending run may reach the end without a kept letter to flush it.
                result.append(path + (str(count) if count else ''))
                return
            # Extend the omitted run rather than creating adjacent numeric tokens.
            visit(i + 1, path, count + 1)
            # Keeping a letter closes the run and starts a fresh one afterward.
            prefix = path + (str(count) if count else '') + word[i]
            visit(i + 1, prefix, 0)
        visit(0, '', 0)
        return result
