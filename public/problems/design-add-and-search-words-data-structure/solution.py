class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            # Shared prefixes reuse the same path.
            node = node.setdefault(ch, {})
        node['#'] = True

    def search(self, word: str) -> bool:
        frontier = [self.root]
        for ch in word:
            next_frontier = []
            for node in frontier:
                if ch == '.':
                    # A wildcard follows every letter edge, never the endpoint marker.
                    next_frontier.extend(child for key, child in node.items() if key != '#')
                elif ch in node:
                    next_frontier.append(node[ch])
            frontier = next_frontier
            if not frontier:
                return False
        # Matching a prefix is insufficient: require a full-word endpoint.
        return any('#' in node for node in frontier)
