/*
  9616 - Parse URL Params
  -------
  by Anderson. J (@andersonjoseph) #medium #infer #string #template-literal

  ### Question

  You're required to implement a type-level parser to parse URL params string into an Union.

  ```ts
  ParseUrlParams<':id'> // id
  ParseUrlParams<'posts/:id'> // id
  ParseUrlParams<'posts/:id/:user'> // id | user
  ```

  > View on GitHub: https://tsch.js.org/9616
*/

/* _____________ Your Code Here _____________ */
// first, ':', param, '/', rest로 구분해서 나눠서 어찌저찌 해보면 되지 않을까
// type ParseUrlParams<T> =
//   T extends `${infer _}:${infer Param}/:${infer Rest}`
//     ? Param | ParseUrlParams<Rest>
//     : T extends `${infer _}:${infer Param}`
//       ? Param extends `${infer First}/`
//         ? First
//         : Param
//       : never;

// 분기처리가 너무 많아짐... 다른 방식을 생각해보자
// 차라리 / 단위로 나누고, 그다음에 : 가 붙어있는지 확인
type ParseUrlParams<T> = T extends `${infer Start}/${infer Rest}`
  ? ParseUrlParams<Start> | ParseUrlParams<Rest>
  : T extends `:${infer Param}`
  ? Param
  : never;

type example = ParseUrlParams<"posts/:id/:user">;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<ParseUrlParams<"">, never>>,
  Expect<Equal<ParseUrlParams<":id">, "id">>,
  Expect<Equal<ParseUrlParams<"posts/:id">, "id">>,
  Expect<Equal<ParseUrlParams<"posts/:id/">, "id">>,
  Expect<Equal<ParseUrlParams<"posts/:id/:user">, "id" | "user">>,
  Expect<Equal<ParseUrlParams<"posts/:id/:user/like">, "id" | "user">>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9616/answer
  > View solutions: https://tsch.js.org/9616/solutions
  > More Challenges: https://tsch.js.org
*/
