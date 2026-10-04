class Solution:
    def findAllConcatenatedWordsInADict(self, words: list[str]) -> list[str]:
        dictionary = set(words)
        result = []
        for word in words:
            reachable = [False] * (len(word) + 1)
            reachable[0] = True
            for end in range(1, len(word) + 1):
                for start in range(end):
                    # The entire word alone is not a concatenation of shorter words.
                    if start == 0 and end == len(word):
                        continue
                    if reachable[start] and word[start:end] in dictionary:
                        reachable[end] = True
                        break
            if reachable[-1]:
                result.append(word)
        return result
