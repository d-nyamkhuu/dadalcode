from __future__ import annotations
class Solution:
    def reverseKGroup(self, head: ListNode, k: int) -> ListNode:
        dummy = ListNode(0, head)
        group_before = dummy
        while True:
            # group_before is the last completed group tail; its next is the untouched suffix.
            kth = group_before
            for _ in range(k):
                kth = kth.next
                if kth is None:
                    # A short tail stays intact because no links were changed.
                    return dummy.next
            group_after = kth.next
            old_head = group_before.next
            prev, current = group_after, old_head
            while current is not group_after:
                # Save the forward link before redirecting it backward.
                following = current.next
                current.next = prev
                prev, current = current, following
            # The kth node is the new head; the old head is the new tail.
            group_before.next = kth
            group_before = old_head
