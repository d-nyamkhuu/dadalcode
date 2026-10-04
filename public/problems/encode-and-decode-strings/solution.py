from __future__ import annotations
from typing import List
class Codec:
    def encode(self, strs: List[str]) -> str:
        chunks = []
        for text in strs:
            # Length makes the payload safe even when it contains #.
            chunks.append(str(len(text)) + '#' + text)
        return ''.join(chunks)
    def decode(self, s: str) -> List[str]:
        result = []
        i = 0
        while i < len(s):
            # Search only the next header; payload delimiters are ordinary text.
            end = s.index('#', i)
            length = int(s[i:end])
            i = end + 1
            result.append(s[i:i + length])
            # The next header starts exactly after this payload.
            i += length
        return result
