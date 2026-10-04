def run(ns, case):
    return ns['Solution']().exist([row[:] for row in case['board']], case['word'])
