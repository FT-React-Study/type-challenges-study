/*
  30301 - IsOdd
  -------
  by jiangshan (@jiangshanmeta) #medium #string

  ### Question

  return true is a number is odd

  > View on GitHub: https://tsch.js.org/30301
*/

/* _____________ Your Code Here _____________ */

// number 자체인지 확인
// float인지 확인
// 마지막 자리 하나 확인
type LastChar<S extends string> = S extends `${infer _}${infer R}`
  ? R extends ""
    ? S
    : LastChar<R>
  : never;

type IsOdd<T extends number> = `${T}` extends
  | `${string}.${string}`
  | `${string}e${string}`
  ? false
  : LastChar<`${T}`> extends "1" | "3" | "5" | "7" | "9"
  ? true
  : false;

type example = IsOdd<5>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<IsOdd<5>, true>>,
  Expect<Equal<IsOdd<2023>, true>>,
  Expect<Equal<IsOdd<1453>, true>>,
  Expect<Equal<IsOdd<1926>, false>>,
  Expect<Equal<IsOdd<2.3>, false>>,
  Expect<Equal<IsOdd<3e23>, false>>,
  Expect<Equal<IsOdd<3>, true>>,
  Expect<Equal<IsOdd<number>, false>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/30301/answer
  > View solutions: https://tsch.js.org/30301/solutions
  > More Challenges: https://tsch.js.org
*/
