from collections import defaultdict
class FreqStack:
    def __init__(self) -> None:
        self.frequency = defaultdict(int)
        self.groups = defaultdict(list)
        self.maximum = 0
    def push(self, val: int) -> None:
        frequency, groups = self.frequency, self.groups
        frequency[val] += 1
        level = frequency[val]
        # Appending records recency among values that have reached this frequency.
        groups[level].append(val)
        self.maximum = max(self.maximum, level)
    def pop(self) -> int:
        frequency, groups = self.frequency, self.groups
        level = self.maximum
        # Highest frequency wins, and the group's stack order breaks recency ties.
        val = groups[level].pop()
        frequency[val] -= 1
        if frequency[val] == 0:
            del frequency[val]
        if not groups[level]:
            del groups[level]
            self.maximum -= 1
        return val
