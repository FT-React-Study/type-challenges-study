/*
  1097 - IsUnion
  -------
  by null (@bencor) #medium #union

  ### Question

  Implement a type `IsUnion`, which takes an input type `T` and returns whether `T` resolves to a union type.

  For example:

  ```ts
  type case1 = IsUnion<string> // false
  type case2 = IsUnion<string | number> // true
  type case3 = IsUnion<[string | number]> // false
  ```

  > View on GitHub: https://tsch.js.org/1097
*/

/* _____________ Your Code Here _____________ */

// 시도 1
// 유니온 -> 튜플 -> 튜플의 length 확인 -> 1보다 크면 유니온 아닐까?
// type UnionToTuple<T, K = T> = [T] extends [never]
//   ? []
//   : K extends K
//     ? [K, ...UnionToTuple<Exclude<T, K>>]
//     : never;

// type IsUnion<T> = UnionToTuple<T>["length"] extends [any] ? true : false;

// type ex1 = UnionToTuple<string | number | boolean>;

// 튜플이 아니라 퍼머테이션으로 나옴...

// 시도2
// 분배법칙으로 각 요소에 어쩌구해서 유니온인지 확인
// 유니온 타입이 아닌 경우 → U와 T가 항상 같음 → false 반환
// 유니온 타입인 경우 → T extends U가 개별 요소로 평가됨 → true 반환
type IsUnion<T, U = T> = [T] extends [never]
  ? false
  : T extends U
    ? [U] extends [T]
      ? false
      : true
    : never;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<IsUnion<string>, false>>,
  Expect<Equal<IsUnion<string | number>, true>>,
  Expect<Equal<IsUnion<"a" | "b" | "c" | "d">, true>>,
  Expect<Equal<IsUnion<undefined | null | void | "">, true>>,
  Expect<Equal<IsUnion<{ a: string } | { a: number }>, true>>,
  Expect<Equal<IsUnion<{ a: string | number }>, false>>,
  Expect<Equal<IsUnion<[string | number]>, false>>,
  // Cases where T resolves to a non-union type.
  Expect<Equal<IsUnion<string | never>, false>>,
  Expect<Equal<IsUnion<string | unknown>, false>>,
  Expect<Equal<IsUnion<string | any>, false>>,
  Expect<Equal<IsUnion<string | "a">, false>>,
  Expect<Equal<IsUnion<never>, false>>,
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/1097/answer
  > View solutions: https://tsch.js.org/1097/solutions
  > More Challenges: https://tsch.js.org
*/
