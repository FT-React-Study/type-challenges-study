/*
  30970 - IsFixedStringLiteralType
  -------
  by 蛭子屋双六 (@sugoroku-y) #medium

  ### Question

  Sometimes you may want to determine whether a string literal is a definite type. For example, when you want to check whether the type specified as a class identifier is a fixed string literal type.

  ```typescript
  type Action<ID extends string> = { readonly id: ID };
  ```

  Since it must be fixed, the following types must be determined as false.

  * never type
  * Union of string literal types
  * Template literal types with embedded string, number, bigint, boolean

  Determine whether the given type S is a definite string literal type.

  > View on GitHub: https://tsch.js.org/30970
*/

/* _____________ Your Code Here _____________ */

// type IfUnion<S extends string, T extends string = S> = S extends T // union일 경우 true / false가 아닌 boolean이 출력
//   ? T extends S
//     ? true
//     : false
//   : never

// type IsFixedStringLiteralType<S extends string> = [S] extends [never] // never 예외처리
//   ? false 
//   : boolean extends IfUnion<S> // union 예외처리
//     ? false
//     : S extends `${string}${string|number|bigint|boolean}${string}` // embedding 템플릿 리터럴 예외처리
//       ? S extends `${string}${true|false|null|undefined}${string}`
//         ? true
//         : false
//       : true

// type test = IsFixedStringLiteralType<'abc'> // false

type IsFixedStringLiteralType<S extends string> = {} extends Record<S, 1> // 템플릿 리터럴 제외
  ? false 
  : Equal<[S], S extends any ? [S] : never> // union 제외

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type testcase =
  | Expect<Equal<IsFixedStringLiteralType<'ABC'>, true>>
  | Expect<Equal<IsFixedStringLiteralType<string>, false>>
  | Expect<Equal<IsFixedStringLiteralType<'ABC' | 'DEF'>, false>>
  | Expect<Equal<IsFixedStringLiteralType<never>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string & {}}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${number}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${bigint}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${boolean}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${true}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${false}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${null}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${undefined}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string & {}}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${number}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${bigint}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${boolean}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${true}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${false}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${null}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${undefined}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${string}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string & {}}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${number}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${bigint}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${boolean}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${true}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${false}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${null}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${undefined}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string & {}}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${number}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${bigint}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${boolean}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${true}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${false}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${null}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${undefined}DEF`>, true>>
  | true

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/30970/answer
  > View solutions: https://tsch.js.org/30970/solutions
  > More Challenges: https://tsch.js.org
*/
