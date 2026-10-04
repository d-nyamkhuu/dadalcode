class Solution:
    def findDisappearedNumbers(self, nums: list[int]) -> list[int]:
        for index in range(len(nums)):
            value = abs(nums[index])
            home = value - 1
            # Repeated appearances must keep the marker negative.
            nums[home] = -abs(nums[home])
        result = []
        for index in range(len(nums)):
            # Unmarked homes identify values that were never encountered.
            if nums[index] > 0:
                result.append(index + 1)
        return result
