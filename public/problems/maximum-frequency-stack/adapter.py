def run(ns, case):
    obj = ns['FreqStack']()
    result = []
    for operation in case['operations']:
        if operation[0] == 'push': result.append(obj.push(operation[1]))
        elif operation[0] == 'pop': result.append(obj.pop())
        else: raise ValueError('Unknown FreqStack operation')
    return result
