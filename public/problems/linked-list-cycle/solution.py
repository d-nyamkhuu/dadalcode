class Solution:
    def hasCycle(self, head):
        slow, fast = head, head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
            # Equality after movement represents an actual revisit, not the initial start.
            if slow is fast:
                return True
        return False
