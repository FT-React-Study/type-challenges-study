/*
  5310 - Join
  -------
  by Pineapple (@Pineapple0919) #medium #array

  ### Question

  Implement the type version of Array.join, Join<T, U> takes an Array T, string or number U and returns the Array T with U stitching up.

  ```ts
  type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
  type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
  type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'
  type Res3 = Join<["o"], "u">; // expected to be 'o'
  ```

  > View on GitHub: https://tsch.js.org/5310
*/

/* _____________ Your Code Here _____________ */

// 걍 First 하나씩 구하면서, 마지막만 아니면 U 끼워넣어서 리턴하기
// 1차 시도
// type Join<T extends (string | number)[], U extends string | number > =
//   T extends [infer First extends string | number, ...infer Rest extends (string | number)[]]
//     ? T['length'] extends 1
//       ? `${First}`
//       : `${First}${U}${Join<Rest, U>}`
//     : ''

// U가 없는 경우가 있네
// 2차 시도
type Join<
  T extends (string | number)[],
  U extends string | number = ","
> = T extends [
  infer First extends string | number,
  ...infer Rest extends (string | number)[]
]
  ? T["length"] extends 1
    ? `${First}`
    : `${First}${U}${Join<Rest, U>}`
  : "";

type example = Join<["1", "1", "1"]>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Join<["a", "p", "p", "l", "e"], "-">, "a-p-p-l-e">>,
  Expect<Equal<Join<["Hello", "World"], " ">, "Hello World">>,
  Expect<Equal<Join<["2", "2", "2"], 1>, "21212">>,
  Expect<Equal<Join<["o"], "u">, "o">>,
  Expect<Equal<Join<[], "u">, "">>,
  Expect<Equal<Join<["1", "1", "1"]>, "1,1,1">>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/5310/answer
  > View solutions: https://tsch.js.org/5310/solutions
  > More Challenges: https://tsch.js.org
*/
