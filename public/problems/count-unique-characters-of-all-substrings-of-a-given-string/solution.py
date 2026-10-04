class Solution:
    def uniqueLetterString(self, s: str) -> int:
        positions = {}
        result = 0
        for i, letter in enumerate(s):
            before, previous = positions.get(letter, (-1, -1))
            # This occurrence supplies the next-equal boundary for the previous one.
            contribution = (previous - before) * (i - previous)
            result += contribution
            positions[letter] = (previous, i)
        for letter, (before, previous) in positions.items():
            # Final occurrences have no next equal letter: the boundary is len(s).
            contribution = (previous - before) * (len(s) - previous)
            result += contribution
        return result
