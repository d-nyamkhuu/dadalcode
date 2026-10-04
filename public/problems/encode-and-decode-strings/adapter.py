def run(ns, case):
    original = list(case['strs'])
    encoded = ns['Codec']().encode(case['strs'])
    if not isinstance(encoded, str):
        raise TypeError('encode must return a string')
    # Reload candidate classes/globals: saved text must suffice without caches.
    try:
        independent = fresh_solution_namespace()['Codec']().decode(encoded)
    except Exception as exc:
        raise ValueError('A saved encoding must decode in a fresh namespace without class or global caches') from exc
    if not equivalent(encode(independent), original):
        raise ValueError('A saved encoding must recover the original strings in a fresh solution namespace')
    # Keep the ordinary decode as the primary visible execution walkthrough.
    return ns['Codec']().decode(encoded)
