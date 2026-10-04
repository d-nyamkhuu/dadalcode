class Solution:
    def moveZeroes(self, nums: list[int]) -> None:
        write = 0
        for read in range(len(nums)):
            if nums[read] != 0:
                # Append the next nonzero; write==read is a harmless self-swap.
                # Otherwise the processed gap is zero, so the swap leaves zero behind.
                nums[write], nums[read] = nums[read], nums[write]
                write += 1
