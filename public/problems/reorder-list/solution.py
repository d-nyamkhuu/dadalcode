class Solution:
    def reorderList(self, head: ListNode) -> None:
        slow, fast = head, head
        # Stop slow at the first-half tail; an odd middle stays in the front half.
        while fast.next and fast.next.next:
            slow = slow.next
            fast = fast.next.next
        current = slow.next
        # Detach before reversal so old links cannot form a cycle during weaving.
        slow.next = None
        previous = None
        while current:
            # Save the untouched suffix before turning this link backward.
            following = current.next
            current.next = previous
            previous, current = current, following
        first, second = head, previous
        while second:
            # Keep both suffixes before weaving one front node and one back node.
            next_first, next_second = first.next, second.next
            first.next = second
            second.next = next_first
            first, second = next_first, next_second
