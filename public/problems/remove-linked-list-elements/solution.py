class Solution:
    def removeElements(self, head: ListNode, val: int) -> ListNode:
        dummy = ListNode(0, head)
        prev = dummy
        while prev.next is not None:
            if prev.next.val == val:
                # Stay here to inspect another potentially matching neighbor.
                prev.next = prev.next.next
            else:
                # This node is retained, so it becomes the next predecessor.
                prev = prev.next
        return dummy.next
