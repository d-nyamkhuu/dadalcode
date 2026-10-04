class Solution:
    def solveNQueens(self, n: int) -> list[list[str]]:
        result, placement = [], []
        columns, descending, ascending = set(), set(), set()
        def search(row):
            if row == n:
                # Convert the completed choices into an independent board snapshot.
                result.append(['.' * col + 'Q' + '.' * (n - col - 1) for col in placement])
                return
            for col in range(n):
                # Equal diagonal keys mean a previous queen attacks this square.
                if col in columns or row - col in descending or row + col in ascending:
                    continue
                placement.append(col)
                columns.add(col)
                descending.add(row - col)
                ascending.add(row + col)
                search(row + 1)
                # Undo exactly this row so the next candidate sees the same parent state.
                placement.pop()
                columns.remove(col)
                descending.remove(row - col)
                ascending.remove(row + col)
        search(0)
        return result
