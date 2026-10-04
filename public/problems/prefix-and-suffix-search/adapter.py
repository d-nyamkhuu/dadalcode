def run(ns, case):
    obj = ns['WordFilter'](case['words'])
    return [obj.f(pref, suff) for pref, suff in case['queries']]
