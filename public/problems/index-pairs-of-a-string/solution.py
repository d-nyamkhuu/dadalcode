class Solution:
    def indexPairs(self, text: str, words: list[str]) -> list[list[int]]:
        trie = {}
        for word in words:
            node = trie
            for letter in word:
                node = node.setdefault(letter, {})
            node['$'] = True
        result = []
        for start in range(len(text)):
            node = trie
            for end in range(start, len(text)):
                letter = text[end]
                if letter not in node:
                    # No dictionary word extends this unmatched prefix.
                    break
                node = node[letter]
                if '$' in node:
                    # Nested increasing indices give the required sorted order naturally.
                    result.append([start, end])
        return result
