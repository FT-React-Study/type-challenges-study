/*
  5117 - Without
  -------
  by Pineapple (@Pineapple0919) #medium #union #array

  ### Question

  Implement the type version of Lodash.without, Without<T, U> takes an Array T, number or array U and returns an Array without the elements of U.

  ```ts
  type Res = Without<[1, 2], 1>; // expected to be [2]
  type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]>; // expected to be [4, 5]
  type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>; // expected to be []
  ```

  > View on GitHub: https://tsch.js.org/5117
*/

/* _____________ Your Code Here _____________ */

// 뒤에 받는 튜플을 유니온으로 만든 뒤, 앞의 것을 하나씩 확인하며 할당 가능 여부 확인
type TupleToUnion<T extends readonly number[] | number> = T extends number[]
  ? T[number]
  : T;

type Without<T extends any[], U extends number | number[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends TupleToUnion<U>
    ? [...Without<Rest, U>]
    : [First, ...Without<Rest, U>]
  : T;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/5117/answer
  > View solutions: https://tsch.js.org/5117/solutions
  > More Challenges: https://tsch.js.org
*/
