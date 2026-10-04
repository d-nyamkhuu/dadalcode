class Solution:
    def numSubarrayProductLessThanK(self, nums: list[int], k: int) -> int:
        if k <= 1:
            return 0
        left, product, count = 0, 1, 0
        for right, value in enumerate(nums):
            product *= value
            # Positive factors make shrinking sufficient to restore validity.
            while product >= k:
                product //= nums[left]
                left += 1
            # Every suffix of this valid window is also valid.
            count += right - left + 1
        return count
