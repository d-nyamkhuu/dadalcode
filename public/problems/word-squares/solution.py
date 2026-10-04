from collections import defaultdict
class Solution:
    def wordSquares(self, words):
        length = len(words[0])
        prefixes = defaultdict(list)
        for word in words:
            # Every prefix can become the constraint for a future row.
            for size in range(length):
                prefixes[word[:size]].append(word)
        square, result = [], []
        def visit():
            k = len(square)
            if k == length:
                result.append(square[:])
                return
            # Crossing letters in existing rows prescribe the new row prefix.
            prefix = ''.join(row[k] for row in square)
            for word in prefixes.get(prefix, []):
                square.append(word)
                visit()
                square.pop()
        visit()
        return result
