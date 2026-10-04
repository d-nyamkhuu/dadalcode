class Codec:

    def serialize(self, root: TreeNode | None) -> str:
        """Return a self-contained string preserving values and null-child positions."""
        pass

    def deserialize(self, data: str) -> TreeNode | None:
        """Reconstruct from a saved serialization string, independently of cached original trees."""
        pass
