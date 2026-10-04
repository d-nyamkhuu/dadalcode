class WordFilter:
    def __init__(self, words: list[str]):
        trie = self.trie = {}
        for index, word in enumerate(words):
            for start in range(len(word) + 1):
                sequence = word[start:] + '{' + word
                node = trie
                for letter in sequence:
                    node = node.setdefault(letter, {})
                    # Later input indices overwrite earlier ones at every matching prefix.
                    node['$'] = index
    def f(self, pref: str, suff: str) -> int:
        trie = self.trie
        node = trie
        sequence = suff + '{' + pref
        for letter in sequence:
            if letter not in node:
                return -1
            node = node[letter]
        # The path matches an exact suffix followed by a prefix of the full word.
        return node['$']
