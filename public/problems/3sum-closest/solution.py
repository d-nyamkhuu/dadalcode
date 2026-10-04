class Solution:
    def threeSumClosest(self, nums: list[int], target: int) -> int:
        nums = sorted(nums)
        best = sum(nums[:3])
        for i in range(len(nums) - 2):
            left, right = i + 1, len(nums) - 1
            while left < right:
                total = nums[i] + nums[left] + nums[right]
                # Keep the actual candidate closest to the target.
                if abs(total - target) < abs(best - target):
                    best = total
                # Sorted values tell us which pointer can help next.
                if total < target:
                    left += 1
                elif total > target:
                    right -= 1
                else:
                    return total
        return best
