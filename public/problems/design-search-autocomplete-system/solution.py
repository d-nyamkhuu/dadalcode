from typing import List

class AutocompleteSystem:
    def __init__(self, sentences: List[str], times: List[int]) -> None:
        self.root = {"children": {}, "hot": []}
        self.counts = {}
        self.prefix = ""
        self.node = self.root
        for sentence, count in zip(sentences, times):
            # Insert historical frequencies before answering any query.
            self._add(sentence, count)

    def _add(self, sentence: str, amount: int) -> None:
        counts = self.counts
        counts[sentence] = counts.get(sentence, 0) + amount
        node = self.root
        for char in sentence:
            # Every character identifies a prefix needing its own cached leaders.
            node = node["children"].setdefault(char, {"children": {}, "hot": []})
            candidates = list(node["hot"])
            if sentence not in candidates:
                # Only this sentence changed rank; no other outsider can enter.
                candidates.append(sentence)
            candidates.sort(key=lambda text: (-counts[text], text))
            node["hot"] = candidates[:3]

    def input(self, c: str) -> List[str]:
        prefix = self.prefix
        if c == "#":
            # A completed query becomes history, then the next query starts fresh.
            self._add(prefix, 1)
            self.prefix = ""
            self.node = self.root
            return []
        prefix += c
        self.prefix = prefix
        node = self.node
        if node is not None:
            # A missing edge stays missing for the rest of this query.
            node = node["children"].get(c)
        self.node = node
        suggestions = list(node["hot"]) if node is not None else []
        return suggestions
