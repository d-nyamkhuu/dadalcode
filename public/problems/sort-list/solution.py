from typing import Optional
class Solution:
    def sortList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        def split(node, width):
            if node is None:
                return None
            # Isolate at most width nodes and return the next run.
            for _ in range(width - 1):
                if node.next is None:
                    break
                node = node.next
            rest = node.next
            node.next = None
            return rest
        def merge(left, right, tail):
            while left and right:
                # Extend the output with the smaller remaining front.
                if left.val <= right.val:
                    tail.next, left = left, left.next
                else:
                    tail.next, right = right, right.next
                tail = tail.next
            tail.next = left or right
            while tail.next:
                tail = tail.next
            return tail
        length = 0
        current = head
        while current:
            length += 1
            current = current.next
        dummy = ListNode(0, head)
        width = 1
        while width < length:
            tail = dummy
            current = dummy.next
            while current:
                left = current
                right = split(left, width)
                current = split(right, width)
                tail = merge(left, right, tail)
            # Every merged run now has twice the previous sorted width.
            width *= 2
        return dummy.next
