/*
  3188 - Tuple to Nested Object
  -------
  by jiangshan (@jiangshanmeta) #보통 #object #tuple

  ### 질문

  Given a tuple type ```T``` that only contains string type, and a type ```U```, build an object recursively.

  ```typescript
  type a = TupleToNestedObject<['a'], string> // {a: string}
  type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
  type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
  ```

  > GitHub에서 보기: https://tsch.js.org/3188/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type Reverse<T extends unknown[], C extends unknown[] = []> = T extends [infer First, ...infer Rest] ? Reverse<Rest, [First, ...C]> : C;
type RecursiveBuilder<T, U, C = U> = T extends [infer First, ...infer Rest] ? RecursiveBuilder<Rest, U, {[K in First extends string ? First : never]: C}> : C;

type TupleToNestedObject<T extends unknown[], U> = RecursiveBuilder<Reverse<T>, U>

type Test = TupleToNestedObject<['a', 'b'], string>

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TupleToNestedObject<['a'], string>, { a: string }>>,
  Expect<Equal<TupleToNestedObject<['a', 'b'], number>, { a: { b: number } }>>,
  Expect<Equal<TupleToNestedObject<['a', 'b', 'c'], boolean>, { a: { b: { c: boolean } } }>>,
  Expect<Equal<TupleToNestedObject<[], boolean>, boolean>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/3188/answer/ko
  > 정답 보기: https://tsch.js.org/3188/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
