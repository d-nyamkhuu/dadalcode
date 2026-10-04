def run(ns, case):
    return tree_values(ns['Solution']().buildTree(case['preorder'], case['inorder']))
