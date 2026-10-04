class Solution:
    def checkInclusion(self, s1: str, s2: str) -> bool:
        if len(s1) > len(s2):
            return False
        target, window = [0] * 26, [0] * 26
        for char in s1:
            target[ord(char) - ord('a')] += 1
        width = len(s1)
        for right, char in enumerate(s2):
            window[ord(char) - ord('a')] += 1
            # Keep exactly width positions rather than letting extra letters accumulate.
            if right >= width:
                window[ord(s2[right - width]) - ord('a')] -= 1
            if right >= width - 1 and window == target:
                return True
        return False
