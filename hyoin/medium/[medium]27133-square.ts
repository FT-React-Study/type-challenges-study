/*
  27133 - Square
  -------
  by null (@aswinsvijay) #medium #tuple #array #math

  ### Question

  Given a number, your type should return its square.

  > View on GitHub: https://tsch.js.org/27133
*/

/* _____________ Your Code Here _____________ */
type Abs<N extends number> = `${N}` extends `-${infer R extends number}` ? R : N;
type SplitZeroes<
   N extends number,
   Z extends string = ''
> = `${N}` extends `${infer N extends number}0` ? SplitZeroes<N, `${Z}00`> : [N, Z];
type SquareTuple<
   N extends number,
   A extends any[] = [],
   Acc extends any[] = []
> = A['length'] extends N ? [...A, ...Acc] : SquareTuple<N, [1, ...A], [...A, ...A, ...Acc]>;

type Square<
   _N extends number,
   N extends [number, string] = SplitZeroes<_N>,
   U extends any[] = SquareTuple<Abs<N[0]>>
> = `${U['length']}${N[1]}` extends `${infer N extends number}` ? N : never;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Square<0>, 0>>,
  Expect<Equal<Square<1>, 1>>,
  Expect<Equal<Square<3>, 9>>,
  Expect<Equal<Square<20>, 400>>,
  Expect<Equal<Square<100>, 10000>>,
  Expect<Equal<Square<101>, 10201>>,

  // Negative numbers
  Expect<Equal<Square<-2>, 4>>,
  Expect<Equal<Square<-5>, 25>>,
  Expect<Equal<Square<-31>, 961>>,
  Expect<Equal<Square<-50>, 2500>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/27133/answer
  > View solutions: https://tsch.js.org/27133/solutions
  > More Challenges: https://tsch.js.org
*/
