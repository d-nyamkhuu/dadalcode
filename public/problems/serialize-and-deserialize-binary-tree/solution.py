class Codec:
    def serialize(self, root: TreeNode | None) -> str:
        tokens, stack = [], [root]
        while stack:
            node = stack.pop()
            if node is None:
                tokens.append('#')
                continue
            tokens.append(str(node.val))
            # LIFO order must process the left subtree before the right subtree.
            stack.append(node.right)
            stack.append(node.left)
        return ','.join(tokens)

    def deserialize(self, data: str) -> TreeNode | None:
        root = None
        slots = [(None, 'root')]
        tokens = data.split(',')
        for token in tokens:
            parent, side = slots.pop()
            node = None if token == '#' else TreeNode(int(token))
            if parent is None:
                root = node
            else:
                setattr(parent, side, node)
            if node is not None:
                # Every real node creates two child slots, including possible nulls.
                slots.append((node, 'right'))
                slots.append((node, 'left'))
        return root
