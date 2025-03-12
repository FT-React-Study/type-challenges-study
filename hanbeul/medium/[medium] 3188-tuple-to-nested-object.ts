/*
  3188 - Tuple to Nested Object
  -------
  by jiangshan (@jiangshanmeta) #medium #object #tuple

  ### Question

  Given a tuple type ```T``` that only contains string type, and a type ```U```, build an object recursively.

  ```typescript
  type a = TupleToNestedObject<['a'], string> // {a: string}
  type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
  type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
  ```

  > View on GitHub: https://tsch.js.org/3188
*/

/* _____________ Your Code Here _____________ */

// 재귀로 first, rest로 나눠서 first: {rest: U} 이런 형태로 가져가도록
// 근데 First가 string 'First'로 추론되네
// type TupleToNestedObject<T extends any[], U> = T extends []
//   ? U
//   : T extends [infer First, ...infer Rest]
//     ? {First: TupleToNestedObject<Rest, U>}
//     : never;

// 문제 조건에 따라 string으로 키값 제어, K라는 변수로 First를 키값으로 받게 추가
type TupleToNestedObject<T extends string[], U> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? { [K in First]: TupleToNestedObject<Rest, U> }
  : U;

type example = TupleToNestedObject<["a"], string>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<TupleToNestedObject<["a"], string>, { a: string }>>,
  Expect<Equal<TupleToNestedObject<["a", "b"], number>, { a: { b: number } }>>,
  Expect<
    Equal<
      TupleToNestedObject<["a", "b", "c"], boolean>,
      { a: { b: { c: boolean } } }
    >
  >,
  Expect<Equal<TupleToNestedObject<[], boolean>, boolean>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/3188/answer
  > View solutions: https://tsch.js.org/3188/solutions
  > More Challenges: https://tsch.js.org
*/
