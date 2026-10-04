def run(ns, case):
    return ns['Solution']().getSum(case['a'], case['b'])


def validate_source(code):
    """Enforce the lesson's explicit arithmetic-operator restriction."""
    import ast
    for node in ast.walk(ast.parse(code)):
        if isinstance(node, (ast.BinOp, ast.AugAssign)) and isinstance(node.op, (ast.Add, ast.Sub)):
            raise ValueError('Use bit operations instead of addition or subtraction operators')
