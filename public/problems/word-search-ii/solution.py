class Solution:
    def findWords(self, board: list[list[str]], words: list[str]) -> list[str]:
        trie = {}
        for word in words:
            node = trie
            for letter in word:
                node = node.setdefault(letter, {})
            node['$'] = word
        rows, columns = len(board), len(board[0])
        result = []
        def search(row, col, parent):
            letter = board[row][col]
            if letter not in parent:
                return
            node = parent[letter]
            # Remove only the terminal marker: a longer word may share this prefix.
            if '$' in node:
                result.append(node.pop('$'))
            board[row][col] = '#'
            for nr, nc in ((row+1,col),(row-1,col),(row,col+1),(row,col-1)):
                if 0 <= nr < rows and 0 <= nc < columns and board[nr][nc] != '#':
                    search(nr, nc, node)
            board[row][col] = letter
            # Once every word below this edge was found, future starts can skip it.
            if not node:
                del parent[letter]
        for row in range(rows):
            for col in range(columns):
                search(row, col, trie)
        return result
