class Solution:
    def reverseBits(self, n: int) -> int:
        result = 0
        for bit_index in range(32):
            # Append the next original low bit to the reversed sequence.
            bit = n & 1
            result = (result << 1) | bit
            n >>= 1
        return result
