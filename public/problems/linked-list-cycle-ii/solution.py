from __future__ import annotations
from typing import Optional
class Solution:
    def detectCycle(self, head: Optional[ListNode]) -> Optional[ListNode]:
        slow = fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
            if slow is fast:
                entrance = head
                # Equal steps cancel the offset and locate the actual cycle entry.
                while entrance is not slow:
                    entrance = entrance.next
                    slow = slow.next
                return entrance
        return None
