/*
  30958 - Pascal's triangle
  -------
  by Aswin S Vijay (@aswinsvijay) #medium #array #math

  ### Question

  Given a number N, construct the Pascal's triangle with N rows.
  [Wikipedia](https://en.wikipedia.org/wiki/Pascal%27s_triangle)

  > View on GitHub: https://tsch.js.org/30958
*/

/* _____________ Your Code Here _____________ */

type MakeSimpleArray<A extends number, Ar extends unknown[] = []> = Ar['length'] extends A
  ? Ar
  : MakeSimpleArray<A,[...Ar, unknown]>

type SimpleSum<A extends number, B extends number> = [...MakeSimpleArray<A>, ...MakeSimpleArray<B>]['length']

type SumTwoEleAllArr<Ar extends number[]> = Ar extends [infer First extends number, ...infer Rest extends number[]]
  ? Rest extends [infer Second extends number, ...infer _Rest]
    ? [SimpleSum<First,Second>, ...SumTwoEleAllArr<Rest>]
    : []
  :[]

type Pascal<N extends number, Arr extends number[][] = [[1],[1,1]], Ele extends number[] = [1,1]> = N extends 1
  ? [[1]]
  : Arr['length'] extends N
  ? Arr
  : Pascal<N, [...Arr, [1,...SumTwoEleAllArr<Ele>, 1]], [1,...SumTwoEleAllArr<Ele>, 1]>


/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<
    Equal<
      Pascal<1>,
      [
        [1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<3>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<5>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<7>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
        [1, 5, 10, 10, 5, 1],
        [1, 6, 15, 20, 15, 6, 1],
      ]
    >
  >,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/30958/answer
  > View solutions: https://tsch.js.org/30958/solutions
  > More Challenges: https://tsch.js.org
*/
