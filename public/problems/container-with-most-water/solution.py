class Solution:
    def maxArea(self, height: list[int]) -> int:
        left, right = 0, len(height) - 1
        best = 0
        while left < right:
            # The smaller wall determines the level that both ends can hold.
            area = (right - left) * min(height[left], height[right])
            best = max(best, area)
            # No narrower container with this shorter wall can beat its current area.
            if height[left] <= height[right]:
                left += 1
            else:
                right -= 1
        return best
