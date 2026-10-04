class Solution:
    def reverseBetween(self, head, left: int, right: int):
        dummy = ListNode(0, head)
        before = dummy
        for position in range(left - 1):
            before = before.next
        current = before.next
        for step in range(right - left):
            # Detach the next original segment node without losing the suffix.
            moving = current.next
            current.next = moving.next
            # Inserting at the front grows the reversed segment by one node.
            moving.next = before.next
            before.next = moving
        return dummy.next
