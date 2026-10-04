class Solution:
    def swapPairs(self, head: ListNode | None) -> ListNode | None:
        dummy = ListNode(0, head)
        previous = dummy
        while previous.next is not None and previous.next.next is not None:
            first, second = previous.next, previous.next.next
            # Preserve the suffix before linking the second node back to the first.
            first.next = second.next
            second.next = first
            previous.next = second
            # The first node is now the final node of this processed pair.
            previous = first
        return dummy.next
