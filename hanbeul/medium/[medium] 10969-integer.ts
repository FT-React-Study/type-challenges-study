/*
  10969 - Integer
  -------
  by HuaBing (@hbcraft) #medium #template-literal

  ### Question

  Please complete type `Integer<T>`, type `T` inherits from `number`, if `T` is an integer return it, otherwise return `never`.

  > View on GitHub: https://tsch.js.org/10969
*/

/* _____________ Your Code Here _____________ */

// 우선 number인지 확인,
// number일 경우 템플릿 리터럴로 분리해버리기
type IsAllZero<T extends string> = T extends `${infer First}${infer Rest}`
  ? First extends "0"
    ? IsAllZero<Rest>
    : false
  : true;

type Integer<T> = [T] extends [number]
  ? number extends T
    ? never
    : `${T}` extends `${infer Int}.${infer Float}`
    ? IsAllZero<Float> extends true
      ? T
      : never
    : T
  : never;

type example = Integer<typeof x>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

let x = 1;
let y = 1 as const;

type cases1 = [
  Expect<Equal<Integer<1>, 1>>,
  Expect<Equal<Integer<1.1>, never>>,
  Expect<Equal<Integer<1.0>, 1>>,
  Expect<Equal<Integer<1.0>, 1>>,
  Expect<Equal<Integer<0.5>, never>>,
  Expect<Equal<Integer<28.0>, 28>>,
  Expect<Equal<Integer<28.101>, never>>,
  Expect<Equal<Integer<typeof x>, never>>,
  Expect<Equal<Integer<typeof y>, 1>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/10969/answer
  > View solutions: https://tsch.js.org/10969/solutions
  > More Challenges: https://tsch.js.org
*/
