class Solution:
    def longestWord(self, words):
        words = sorted(words, key=lambda word: (len(word), word))
        buildable, best = {''}, ''
        for word in words:
            # A certified shorter prefix proves every earlier construction step exists.
            if word[:-1] in buildable:
                buildable.add(word)
                # Equal-length candidates arrive lexicographically; keep the first.
                if len(word) > len(best):
                    best = word
        return best
