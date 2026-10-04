from heapq import heappush, heapreplace

class Solution:
    def kClosest(self, points, k: int):
        heap = []
        for index, point in enumerate(points):
            distance = point[0] * point[0] + point[1] * point[1]
            if len(heap) < k:
                heappush(heap, (-distance, index))
            elif distance < -heap[0][0]:
                # Evict the farthest retained point to improve the closest-k set.
                heapreplace(heap, (-distance, index))
        return [points[index] for _, index in heap]
