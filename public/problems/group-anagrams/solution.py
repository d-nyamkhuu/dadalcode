from collections import defaultdict
class Solution:
    def groupAnagrams(self, strs):
        groups = defaultdict(list)
        for word in strs:
            counts = [0] * 26
            for char in word:
                counts[ord(char) - ord('a')] += 1
            # A count tuple identifies exactly one anagram equivalence class.
            signature = tuple(counts)
            groups[signature].append(word)
        return list(groups.values())
