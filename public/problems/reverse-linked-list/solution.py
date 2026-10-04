class Solution:
    def reverseList(self, head):
        previous, current = None, head
        while current:
            # Preserve the original suffix before reversing the current edge.
            following = current.next
            # Initially previous=None, so the old head becomes the null-terminated tail.
            current.next = previous
            previous, current = current, following
        return previous
