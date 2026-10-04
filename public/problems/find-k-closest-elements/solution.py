class Solution:
    def findClosestElements(self, arr: list[int], k: int, x: int) -> list[int]:
        left, right = 0, len(arr) - k
        while left < right:
            mid = (left + right) // 2
            # Shifting drops arr[mid] and gains arr[mid+k]; ties favor the smaller value.
            if x - arr[mid] > arr[mid + k] - x:
                left = mid + 1
            else:
                right = mid
        return arr[left:left + k]
