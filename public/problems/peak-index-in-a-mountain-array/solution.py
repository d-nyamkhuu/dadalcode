class Solution:
    def peakIndexInMountainArray(self, arr: list[int]) -> int:
        left, right = 0, len(arr) - 1
        while left < right:
            mid = (left + right) // 2
            # A rising edge proves the peak lies strictly after mid.
            if arr[mid] < arr[mid + 1]:
                left = mid + 1
            else:
                # A falling edge includes mid as a possible peak.
                right = mid
        return left
