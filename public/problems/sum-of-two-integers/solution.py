class Solution:
    def getSum(self, a: int, b: int) -> int:
        mask = 0xFFFFFFFF
        signed_max = 0x7FFFFFFF
        a &= mask
        b &= mask
        while b:
            # Common one bits generate carries into the next bit positions.
            carry = ((a & b) << 1) & mask
            a = (a ^ b) & mask
            b = carry
        # Complementing the inverted 32-bit word restores Python's signed value.
        return a if a <= signed_max else ~(a ^ mask)
