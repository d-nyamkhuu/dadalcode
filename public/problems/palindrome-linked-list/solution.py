class Solution:
    def isPalindrome(self, head: ListNode) -> bool:
        def reverse(node):
            previous = None
            current = node
            while current is not None:
                # Save the remaining chain before reversing this edge.
                following = current.next
                current.next = previous
                previous, current = current, following
            return previous

        slow = fast = head
        while fast is not None and fast.next is not None:
            slow = slow.next
            fast = fast.next.next
        # Odd length leaves the unpaired center at slow.
        if fast is not None:
            slow = slow.next
        second = reverse(slow)
        left, right = head, second
        matches = True
        while right is not None:
            if left.val != right.val:
                matches = False
                break
            left, right = left.next, right.next
        # Restore links even after an early mismatch.
        reverse(second)
        return matches
