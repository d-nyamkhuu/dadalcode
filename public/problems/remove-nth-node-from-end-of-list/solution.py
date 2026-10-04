class Solution:
    def removeNthFromEnd(self, head: ListNode, n: int) -> ListNode:
        dummy = ListNode(0, head)
        fast = slow = dummy
        for _ in range(n + 1):
            # This gap makes slow stop immediately before the deletion target.
            fast = fast.next
        while fast is not None:
            fast = fast.next
            slow = slow.next
        # Link around the target while preserving the remaining nodes.
        slow.next = slow.next.next
        return dummy.next
