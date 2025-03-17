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

// 걍 재귀 돌리기, 근데 더하기가 안되니까 array에 뭔가를 넣고, 그 length를 이용해보자
type Fibonacci<
  T extends number,
  Fibo1 extends any[] = ["f"],
  Fibo2 extends any[] = ["f"],
  Count extends any[] = ["f", "f", "f"]
> = T extends 1 | 2
  ? 1
  : Count["length"] extends T
  ? [...Fibo1, ...Fibo2]["length"]
  : Fibonacci<T, Fibo2, [...Fibo1, ...Fibo2], [...Count, "f"]>;

type example = Fibonacci<3>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Fibonacci<1>, 1>>,
  Expect<Equal<Fibonacci<2>, 1>>,
  Expect<Equal<Fibonacci<3>, 2>>,
  Expect<Equal<Fibonacci<8>, 21>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4182/answer
  > View solutions: https://tsch.js.org/4182/solutions
  > More Challenges: https://tsch.js.org
*/
