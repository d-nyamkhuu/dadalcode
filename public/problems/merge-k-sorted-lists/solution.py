from heapq import heapify, heappush, heappop

class Solution:
    def mergeKLists(self, lists):
        # Even empty members must be inspected; one tuple per nonempty head suffices.
        heap = [(node.val, list_index, node)
                for list_index, node in enumerate(lists) if node is not None]
        # Heapify all initial candidates in linear time; list numbers break value ties.
        heapify(heap)
        dummy = ListNode(0)
        tail = dummy
        while heap:
            value, list_index, node = heappop(heap)
            # Expose this list's next candidate before changing links.
            if node.next is not None:
                heappush(heap, (node.next.val, list_index, node.next))
            # The minimum head is the next node in the merged order.
            tail.next = node
            tail = node
        tail.next = None
        return dummy.next
