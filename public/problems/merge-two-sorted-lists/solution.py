class Solution:
    def mergeTwoLists(self, list1, list2):
        dummy = ListNode(0)
        tail = dummy
        while list1 and list2:
            # Both heads are minima of their remaining sorted suffixes.
            if list1.val <= list2.val:
                tail.next = list1
                list1 = list1.next
            else:
                tail.next = list2
                list2 = list2.next
            tail = tail.next
        # The surviving suffix is already sorted, so splice it in at once.
        tail.next = list1 or list2
        return dummy.next
