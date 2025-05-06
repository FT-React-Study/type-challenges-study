type IdxNext<Arr extends 0[][] = [],  Head extends 0[][] = [[0]] > =
  Arr extends [ infer A extends 0[], infer B extends 0[], ...infer Rest extends 0[][] ]
    ? [ ...Head, [ ...A, ...B ], ...IdxNext<[B, ...Rest], []> ]
    : Arr extends []
      ? []
      : [ ...Head, [0] ]

type IdxNextByNumber<N extends number, Counter extends 0[] = [], Last extends 0[][] = [[0]]> =
  N extends Counter['length']
    ? Last
    : IdxNextByNumber<N, [ ...Counter, 0 ], IdxNext<Last extends [] ? [[0]] : Last>>

type IdxArr<N extends number, Arr = IdxNextByNumber<N>> =
  Arr extends [ infer A extends 0[], ...infer Rest extends 0[][] ]
    ? [ A['length'], ...IdxArr<0, Rest> ]
    : []

type Pascal<N extends number, Counter extends 0[] = []> =
  N extends Counter['length']
    ? []
    : [ IdxArr<Counter['length']>, ...Pascal<N, [ ...Counter, 0 ]> ]