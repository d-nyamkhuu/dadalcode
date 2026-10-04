class NumArray:
    def __init__(self, nums: list[int]) -> None:
        self.prefix = [0]
        for value in nums:
            # Entry k stores exactly the first k values, including an empty prefix.
            self.prefix.append(self.prefix[-1] + value)
    def sumRange(self, left: int, right: int) -> int:
        # Subtract the values strictly before left from the prefix through right.
        prefix = self.prefix
        return prefix[right + 1] - prefix[left]
