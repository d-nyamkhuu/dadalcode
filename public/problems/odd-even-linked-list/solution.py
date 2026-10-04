class Solution:
    def oddEvenList(self, head: ListNode | None) -> ListNode | None:
        if head is None:
            return None
        odd, even = head, head.next
        even_head = even
        while even is not None and even.next is not None:
            # Append the next odd-position node to the odd chain.
            odd.next = even.next
            odd = odd.next
            # Append the next even-position node, which may be absent.
            even.next = odd.next
            even = even.next
        # Preserve each group's order and put all evens after all odds.
        odd.next = even_head
        return head
