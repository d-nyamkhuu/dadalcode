def run(ns, case):
    nums = list(case['nums'])
    ns['Solution']().sortColors(nums)
    return nums


def validate_source(code):
    """Reject common library-sort calls on the supplied color array."""
    import ast
    tree = ast.parse(code)

    class Bindings(ast.NodeVisitor):
        def __init__(self):
            self.counts = {}
            self.assignments = []
            self.calls = []

        def bind(self, name):
            self.counts[name] = self.counts.get(name, 0) + 1

        def visit_Lambda(self, node):
            # Nested scopes are outside the direct-call teaching check.
            pass

        def visit_Call(self, node):
            self.calls.append(node)
            self.generic_visit(node)

        def visit_ExceptHandler(self, node):
            if node.name:
                self.bind(node.name)
            self.generic_visit(node)

        def visit_Name(self, node):
            if isinstance(node.ctx, ast.Store):
                self.bind(node.id)

        def visit_FunctionDef(self, node):
            self.bind(node.name)

        visit_AsyncFunctionDef = visit_FunctionDef
        visit_ClassDef = visit_FunctionDef

        def visit_Import(self, node):
            for alias in node.names:
                self.bind(alias.asname or alias.name.split('.')[0])

        def visit_ImportFrom(self, node):
            for alias in node.names:
                self.bind(alias.asname or alias.name)

        def visit_Assign(self, node):
            self.assignments.append(node)
            self.generic_visit(node)

    global_bindings = Bindings()
    for statement in tree.body:
        global_bindings.visit(statement)
    owners = [node for node in tree.body if isinstance(node, ast.ClassDef) and node.name == 'Solution']
    methods = [method for owner in owners for method in owner.body
               if isinstance(method, (ast.FunctionDef, ast.AsyncFunctionDef))
               and method.name == 'sortColors']
    for method in methods:
        arguments = method.args.posonlyargs + method.args.args
        if len(arguments) < 2:
            continue
        local_bindings = Bindings()
        for argument in (arguments + method.args.kwonlyargs):
            local_bindings.bind(argument.arg)
        for statement in method.body:
            local_bindings.visit(statement)
        shadowed = global_bindings.counts.keys() | local_bindings.counts.keys()
        arrays = {arguments[1].arg}
        sorted_names = set() if 'sorted' in shadowed else {'sorted'}
        builtin_list = 'list' not in shadowed
        bound_names, unbound_names = set(), set()

        def is_array(node):
            return (isinstance(node, ast.Name) and node.id in arrays
                    or isinstance(node, ast.Call) and isinstance(node.func, ast.Name)
                    and builtin_list and node.func.id == 'list' and len(node.args) == 1 and is_array(node.args[0]))

        def is_sort_method(node):
            return (isinstance(node, ast.Attribute) and node.attr == 'sort'
                    and (is_array(node.value) or isinstance(node.value, ast.Name)
                         and builtin_list and node.value.id == 'list'))

        # Follow straightforward aliases without classifying unrelated helpers.
        assignments = local_bindings.assignments
        changed = True
        while changed:
            before = len(arrays), len(sorted_names), len(bound_names), len(unbound_names)
            for assignment in assignments:
                for target in assignment.targets:
                    if (not isinstance(target, ast.Name)
                            or local_bindings.counts.get(target.id) != 1):
                        # Ambiguous/rebound names are outside this conservative check.
                        continue
                    if is_array(assignment.value):
                        arrays.add(target.id)
                    if isinstance(assignment.value, ast.Name) and assignment.value.id in sorted_names:
                        sorted_names.add(target.id)
                    if (is_sort_method(assignment.value) and is_array(assignment.value.value)
                            or isinstance(assignment.value, ast.Name) and assignment.value.id in bound_names):
                        bound_names.add(target.id)
                    if (is_sort_method(assignment.value) and not is_array(assignment.value.value)
                            or isinstance(assignment.value, ast.Name) and assignment.value.id in unbound_names):
                        unbound_names.add(target.id)
            changed = before != (len(arrays), len(sorted_names), len(bound_names), len(unbound_names))
        for call in local_bindings.calls:
            direct_sorted = (isinstance(call.func, ast.Name) and call.func.id in sorted_names
                             and call.args and is_array(call.args[0]))
            bound_sort = (is_sort_method(call.func)
                          and (is_array(call.func.value)
                               or call.args and is_array(call.args[0])))
            aliased_sort = (isinstance(call.func, ast.Name)
                            and (call.func.id in bound_names or call.func.id in unbound_names
                                 and call.args and is_array(call.args[0])))
            if direct_sorted or bound_sort or aliased_sort:
                raise ValueError('Rearrange the color array without sorted or list.sort')
