from typing import Optional

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        # A dummy node lets every digit use the same append operation.
        dummy = ListNode(0)
        tail = dummy
        carry = 0
        while l1 or l2 or carry:
            # Missing digits count as zero when one number is shorter.
            a = l1.val if l1 else 0
            b = l2.val if l2 else 0
            total = a + b + carry
            # Keep the units digit here; carry the tens into the next column.
            carry, digit = divmod(total, 10)
            tail.next = ListNode(digit)
            tail = tail.next
            if l1:
                l1 = l1.next
            if l2:
                l2 = l2.next
        return dummy.next
