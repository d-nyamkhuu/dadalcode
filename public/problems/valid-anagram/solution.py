class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) != len(t):
            return False
        counts = {}
        for ch in s:
            counts[ch] = counts.get(ch, 0) + 1
        for ch in t:
            # Consume one available copy; a deficit disproves equality.
            counts[ch] = counts.get(ch, 0) - 1
            if counts[ch] < 0:
                return False
        return True
