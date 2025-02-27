/*
  2693 - EndsWith
  -------
  by jiangshan (@jiangshanmeta) #medium #template-literal

  ### Question

  Implement `EndsWith<T, U>` which takes two exact string types and returns whether `T` ends with `U`

  For example:

  ```typescript
  type a = EndsWith<'abc', 'bc'> // expected to be true
  type b = EndsWith<'abc', 'abc'> // expected to be true
  type c = EndsWith<'abc', 'd'> // expected to be false
  ```

  > View on GitHub: https://tsch.js.org/2693
*/

/* _____________ Your Code Here _____________ */

// string을 뒤집는 타입을 만들어서 startsWith와 같은 방식으로 해결하면?
type ReverseString<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${ReverseString<Rest>}${First}`
  : S;

type StartsWith<T extends string, U extends string> = T extends U
  ? true
  : T extends `${infer TFirst}${infer TRest}`
    ? U extends `${infer UFirst}${infer URest}`
      ? TFirst extends UFirst
        ? StartsWith<TRest, URest>
        : false
      : true
    : false;

type EndsWith<T extends string, U extends string> = StartsWith<
  ReverseString<T>,
  ReverseString<U>
>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<EndsWith<"abc", "bc">, true>>,
  Expect<Equal<EndsWith<"abc", "abc">, true>>,
  Expect<Equal<EndsWith<"abc", "d">, false>>,
  Expect<Equal<EndsWith<"abc", "ac">, false>>,
  Expect<Equal<EndsWith<"abc", "">, true>>,
  Expect<Equal<EndsWith<"abc", " ">, false>>,
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2693/answer
  > View solutions: https://tsch.js.org/2693/solutions
  > More Challenges: https://tsch.js.org
*/
