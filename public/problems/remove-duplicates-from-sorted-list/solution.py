class Solution:
    def deleteDuplicates(self, head: ListNode | None) -> ListNode | None:
        current = head
        while current is not None and current.next is not None:
            # Sorted duplicate values are adjacent; bypass one copy.
            if current.val == current.next.val:
                current.next = current.next.next
            else:
                # Advance only after this complete duplicate run is resolved.
                current = current.next
        return head
