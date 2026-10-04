class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        # The shorter array gives legal cuts and the smallest search space.
        if len(nums1) > len(nums2):
            nums1, nums2 = nums2, nums1
        m, n = len(nums1), len(nums2)
        left_size = (m + n + 1) // 2
        low, high = 0, m
        while low <= high:
            i = (low + high) // 2
            j = left_size - i
            a_left = nums1[i - 1] if i else float('-inf')
            a_right = nums1[i] if i < m else float('inf')
            b_left = nums2[j - 1] if j else float('-inf')
            b_right = nums2[j] if j < n else float('inf')
            # Both cross checks ensure every lower-half value precedes the upper half.
            if a_left <= b_right and b_left <= a_right:
                if (m + n) % 2:
                    return max(a_left, b_left)
                return (max(a_left, b_left) + min(a_right, b_right)) / 2
            # Too many first-array values lie on the left; move its cut left.
            if a_left > b_right:
                high = i - 1
            else:
                low = i + 1
