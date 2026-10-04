from __future__ import annotations
class Solution:
    def middleNode(self, head: ListNode) -> ListNode:
        slow = fast = head
        while fast is not None and fast.next is not None:
            # One-to-two speed ratio puts slow at floor(length/2).
            slow = slow.next
            fast = fast.next.next
        return slow
