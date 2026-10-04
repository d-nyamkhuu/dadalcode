def run(ns, case):
    system = ns["AutocompleteSystem"](case["sentences"], case["times"])
    return [system.input(char) for char in case["chars"]]
