class Solution:
    def rotate(self, nums: list[int], k: int) -> None:
        n = len(nums)
        k %= n
        # Complete revolutions need no swaps.
        if k == 0:
            return
        def reverse(left, right):
            while left < right:
                # Exchange endpoints to reverse this segment without copying it.
                nums[left], nums[right] = nums[right], nums[left]
                left += 1
                right -= 1
        # Swap segment positions, then restore the order inside each segment.
        reverse(0, n - 1)
        reverse(0, k - 1)
        reverse(k, n - 1)
