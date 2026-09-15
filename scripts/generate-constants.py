#!/usr/bin/env python3
"""Regenerate Website of Babel mathematical digit corpora.

Build-time/developer utility only. It is not required by Vercel at runtime.
Requires: Python 3 + mpmath (`python -m pip install mpmath`).

Each corpus stores the leading decimal digits with the decimal point removed.
For example pi begins 314159..., e begins 271828..., and ln(2) begins 069314...
Guard digits are calculated and trimmed before hashing/writing.
"""
from pathlib import Path
import hashlib, json
import mpmath as mp

OUT=Path(__file__).resolve().parents[1]/'public'/'data'
SPECS={
    'pi':('pi-1m.txt',1_000_000),
    'e':('e-250k.txt',250_000),
    'phi':('phi-250k.txt',250_000),
    'sqrt2':('sqrt2-250k.txt',250_000),
    'sqrt3':('sqrt3-250k.txt',250_000),
    'ln2':('ln2-250k.txt',250_000),
}

def value(name):
    return {
        'pi': lambda: mp.pi,
        'e': lambda: mp.e,
        'phi': lambda: (1+mp.sqrt(5))/2,
        'sqrt2': lambda: mp.sqrt(2),
        'sqrt3': lambda: mp.sqrt(3),
        'ln2': lambda: mp.log(2),
    }[name]()

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    meta={}
    for name,(filename,count) in SPECS.items():
        mp.mp.dps=count+40
        digits=mp.nstr(value(name),count+8).replace('.','')[:count]
        if len(digits)!=count or not digits.isdigit():
            raise RuntimeError(f'{name}: generated {len(digits)} invalid digits')
        (OUT/filename).write_text(digits,encoding='ascii')
        digest=hashlib.sha256(digits.encode('ascii')).hexdigest()
        meta[name]={'file':f'/data/{filename}','digits':count,'sha256':digest}
        print(f'{name:6} {count:>10,} {digest}')
    (OUT/'math-constants.json').write_text(json.dumps(meta,indent=2)+'\n',encoding='utf-8')

if __name__=='__main__': main()
