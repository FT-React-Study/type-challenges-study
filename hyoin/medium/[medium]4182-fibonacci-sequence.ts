/*
  4182 - Fibonacci Sequence
  -------
  by windliang (@wind-liang) #medium

  ### Question

  Implement a generic `Fibonacci<T>` that takes a number `T` and returns its corresponding [Fibonacci number](https://en.wikipedia.org/wiki/Fibonacci_number).

  The sequence starts:
  1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...

  For example
  ```ts
  type Result1 = Fibonacci<3> // 2
  type Result2 = Fibonacci<8> // 21
  ```

  > View on GitHub: https://tsch.js.org/4182
*/

/* _____________ Your Code Here _____________ */

// 기존 MinusOne 코드
type ParseInt<T extends string> = T extends `${infer Digit extends number}` ? Digit : never
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}` ? `${ReverseString<Rest>}${First}` : ''

type RemoveLeadingZeros<S extends string> = S extends '0' ? S : S extends `${'0'}${infer R}` ? RemoveLeadingZeros<R> : S

type InternalMinusOne<
  S extends string
> = S extends `${infer Digit extends number}${infer Rest}` ?
    Digit extends 0 ?
      `9${InternalMinusOne<Rest>}` :
    `${[9, 0, 1, 2, 3, 4, 5, 6, 7, 8][Digit]}${Rest}`:
  never

type MyMinusOne<T extends number> = ParseInt<RemoveLeadingZeros<ReverseString<InternalMinusOne<ReverseString<`${T}`>>>>>

type MakeArray<T extends number> = T extends 0 ? [] : [0, ...MakeArray<MyMinusOne<T>>]

type AddNum<F extends number,S extends number> = [...MakeArray<F>,...MakeArray<S>]['length']

type Fibonacci<T extends number> = T extends 1 
  ? 1
  : T extends 2
    ? 1
    : AddNum<Fibonacci<MyMinusOne<T>>, Fibonacci<MyMinusOne<MyMinusOne<T>>>>

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4182/answer
  > View solutions: https://tsch.js.org/4182/solutions
  > More Challenges: https://tsch.js.org
*/
