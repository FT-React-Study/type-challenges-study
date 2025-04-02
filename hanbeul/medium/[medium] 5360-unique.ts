/*
  5360 - Unique
  -------
  by Pineapple (@Pineapple0919) #medium #array

  ### Question

  Implement the type version of Lodash.uniq, Unique<T> takes an Array T, returns the Array T without repeated values.

  ```ts
  type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
  type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
  type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
  type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
  type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
  ```

  > View on GitHub: https://tsch.js.org/5360
*/

/* _____________ Your Code Here _____________ */

// 이미 존재하는 element를 저장하는 유니온을 하나 만들어서 어레이 돌면서 확인
// type Unique<T extends any[], Exists = never, Result extends any[] = []> =
//   T extends [infer First, ...infer Rest]
//     ? First extends Exists
//       ? Unique<Rest, Exists, Result>
//       : Unique<Rest, Exists | First, [...Result, First]>
//     : Result;

// 생각해보니까, MyEqual 처럼 extends 만으로 다 해결이 안되네
// 차라리 요소 다 돌면서 MyEqual 하나라도 맞으면 리턴하는 방식으로
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type MyExtends<T, Exists extends any[]> = Exists extends [
  infer First,
  ...infer Rest
]
  ? MyEqual<T, First> extends true
    ? true
    : MyExtends<T, Rest>
  : false;

type Unique<
  T extends any[],
  Exists extends any[] = [],
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? MyExtends<First, Exists> extends true
    ? Unique<Rest, Exists, Result>
    : Unique<Rest, [...Exists, First], [...Result, First]>
  : Result;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Unique<[1, 1, 2, 2, 3, 3]>, [1, 2, 3]>>,
  Expect<Equal<Unique<[1, 2, 3, 4, 4, 5, 6, 7]>, [1, 2, 3, 4, 5, 6, 7]>>,
  Expect<Equal<Unique<[1, "a", 2, "b", 2, "a"]>, [1, "a", 2, "b"]>>,
  Expect<
    Equal<
      Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>,
      [string, number, 1, "a", 2, "b"]
    >
  >,
  Expect<
    Equal<
      Unique<[unknown, unknown, any, any, never, never]>,
      [unknown, any, never]
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/5360/answer
  > View solutions: https://tsch.js.org/5360/solutions
  > More Challenges: https://tsch.js.org
*/
