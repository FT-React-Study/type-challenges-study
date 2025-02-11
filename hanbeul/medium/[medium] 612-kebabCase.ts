/*
  612 - KebabCase
  -------
  by Johnson Chu (@johnsoncodehk) #보통 #template-literal

  ### 질문

  `camelCase`나 `PascalCase`를 `kebab-case` 문자열로 수정하세요.

  `FooBarBaz` -> `foo-bar-baz`

  예시:

  ```ts
  type FooBarBaz = KebabCase<"FooBarBaz">
  const foobarbaz: FooBarBaz = "foo-bar-baz"

  type DoNothing = KebabCase<"do-nothing">
  const doNothing: DoNothing = "do-nothing"
  ```

  > GitHub에서 보기: https://tsch.js.org/612/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// 1차시도
// type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;

// type MakeKebabCase<S extends string> = S extends `${infer First}${infer Rest}`
//   ? IsUpperCase<First> extends true
//     ? `-${Lowercase<First>}${MakeKebabCase<Rest>}`
//     : `${First}${MakeKebabCase<Rest>}`
//   : '';

// type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
//   ? IsUpperCase<First> extends true
//     ? `${Lowercase<First>}${MakeKebabCase<Rest>}`
//     : `${First}${MakeKebabCase<Rest>}`
//   : '';

// type ex1 = KebabCase<'foo-bar'>;
// "foo--bar"
// type ex2 = KebabCase<'foo_bar'>;
// "foo-_bar"
// type ex3 = KebabCase<'Foo-Bar'>;
// "foo---bar"

// 2차시도
type IsAlphabet<T extends string> =
  Lowercase<T> extends Uppercase<T> ? false : true;

type IsUpperCase<T extends string> =
  IsAlphabet<T> extends true ? (Uppercase<T> extends T ? true : false) : false;

type MakeKebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? IsUpperCase<First> extends true
    ? `-${Lowercase<First>}${MakeKebabCase<Rest>}`
    : `${First}${MakeKebabCase<Rest>}`
  : "";

type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? IsUpperCase<First> extends true
    ? `${Lowercase<First>}${MakeKebabCase<Rest>}`
    : `${First}${MakeKebabCase<Rest>}`
  : "";

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<KebabCase<"FooBarBaz">, "foo-bar-baz">>,
  Expect<Equal<KebabCase<"fooBarBaz">, "foo-bar-baz">>,
  Expect<Equal<KebabCase<"foo-bar">, "foo-bar">>,
  Expect<Equal<KebabCase<"foo_bar">, "foo_bar">>,
  Expect<Equal<KebabCase<"Foo-Bar">, "foo--bar">>,
  Expect<Equal<KebabCase<"ABC">, "a-b-c">>,
  Expect<Equal<KebabCase<"-">, "-">>,
  Expect<Equal<KebabCase<"">, "">>,
  Expect<Equal<KebabCase<"😎">, "😎">>,
];

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/612/answer/ko
  > 정답 보기: https://tsch.js.org/612/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
