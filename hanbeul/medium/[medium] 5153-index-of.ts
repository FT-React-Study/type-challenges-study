/*
  5153 - IndexOf
  -------
  by Pineapple (@Pineapple0919) #medium #array

  ### Question

  Implement the type version of Array.indexOf, indexOf<T, U> takes an Array T, any U and returns the index of the first U in Array T.

  ```ts
  type Res = IndexOf<[1, 2, 3], 2>; // expected to be 1
  type Res1 = IndexOf<[2,6, 3,8,4,1,7, 3,9], 3>; // expected to be 2
  type Res2 = IndexOf<[0, 0, 0], 2>; // expected to be -1
  ```

  > View on GitHub: https://tsch.js.org/5153
*/

/* _____________ Your Code Here _____________ */

// 인덱스를 계산하는 어레이를 하나 두고, 튜플을 하나씩 확인하며 넘어가자
// type IndexOf<T extends any[], U, IndexArr extends unknown[] = []> =
//   T extends [infer First, ...infer Rest]
//     ? First extends U
//       ? IndexArr['length']
//       : IndexOf<Rest, U, [...IndexArr, unknown]>
//     : -1

// number와 같은 타입, 그리고 any를 제대로 처리하지 못함
// First extends U 대신 더 강력한 타입비교를 만들어야 할 듯
// 기존에 사용했던 MyEqual을 가져오자

type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IndexOf<T extends any[], U, IndexArr extends unknown[] = []> = T extends [
  infer First,
  ...infer Rest
]
  ? MyEqual<First, U> extends true
    ? IndexArr["length"]
    : IndexOf<Rest, U, [...IndexArr, unknown]>
  : -1;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<IndexOf<[1, 2, 3], 2>, 1>>,
  Expect<Equal<IndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 2>>,
  Expect<Equal<IndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<IndexOf<[string, 1, number, "a"], number>, 2>>,
  Expect<Equal<IndexOf<[string, 1, number, "a", any], any>, 4>>,
  Expect<Equal<IndexOf<[string, "a"], "a">, 1>>,
  Expect<Equal<IndexOf<[any, 1], 1>, 1>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/5153/answer
  > View solutions: https://tsch.js.org/5153/solutions
  > More Challenges: https://tsch.js.org
*/
