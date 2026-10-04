from typing import List
class Solution:
    def countRangeSum(self, nums: List[int], lower: int, upper: int) -> int:
        prefix = [0]
        for value in nums:
            prefix.append(prefix[-1] + value)
        buffer = [0] * len(prefix)
        def count_sort(start, end):
            if end - start <= 1:
                return 0
            mid = (start + end) // 2
            count = count_sort(start, mid) + count_sort(mid, end)
            low = high = mid
            for i in range(start, mid):
                # Accepted right prefixes fall between these inclusive bounds.
                while low < end and prefix[low] - prefix[i] < lower:
                    low += 1
                while high < end and prefix[high] - prefix[i] <= upper:
                    high += 1
                count += high - low
            i, j, write_at = start, mid, start
            while i < mid or j < end:
                # Sort this range so the parent can count with monotone pointers.
                if j == end or (i < mid and prefix[i] <= prefix[j]):
                    buffer[write_at] = prefix[i]
                    i += 1
                else:
                    buffer[write_at] = prefix[j]
                    j += 1
                write_at += 1
            for i in range(start, end):
                prefix[i] = buffer[i]
            return count
        return count_sort(0, len(prefix))
