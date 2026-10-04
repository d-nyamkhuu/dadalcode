from collections import Counter, defaultdict
class Solution:
    def findSubstring(self, s: str, words: list[str]) -> list[int]:
        width, count = len(words[0]), len(words)
        if width * count > len(s):
            return []
        need = Counter(words)
        result = []
        for offset in range(width):
            left, used = offset, 0
            window = defaultdict(int)
            for right in range(offset, len(s) - width + 1, width):
                word = s[right:right + width]
                # An unknown token breaks every possible window crossing it.
                if word not in need:
                    window.clear()
                    used = 0
                    left = right + width
                    continue
                window[word] += 1
                used += 1
                # Remove whole tokens until the newest word respects its quota.
                while window[word] > need[word]:
                    outgoing = s[left:left + width]
                    window[outgoing] -= 1
                    used -= 1
                    left += width
                # All quotas must now be exact because their totals agree.
                if used == count:
                    result.append(left)
        return result
