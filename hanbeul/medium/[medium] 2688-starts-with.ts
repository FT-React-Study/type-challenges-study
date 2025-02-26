/*
  2688 - StartsWith
  -------
  by jiangshan (@jiangshanmeta) #medium #template-literal

  ### Question

  Implement `StartsWith<T, U>` which takes two exact string types and returns whether `T` starts with `U`

  For example

  ```typescript
  type a = StartsWith<'abc', 'ac'> // expected to be false
  type b = StartsWith<'abc', 'ab'> // expected to be true
  type c = StartsWith<'abc', 'abcd'> // expected to be false
  ```

  > View on GitHub: https://tsch.js.org/2688
*/

/* _____________ Your Code Here _____________ */

// infer를 통해 맨 앞 한글자씩을 비교해보자
// 죽도록 비교해서 지는 쪽이 boolean이 되도록...

type StartsWith<T extends string, U extends string> = T extends U
  ? true
  : T extends `${infer TFirst}${infer TRest}`
    ? U extends `${infer UFirst}${infer URest}`
      ? TFirst extends UFirst
        ? StartsWith<TRest, URest>
        : false
      : true
    : false;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<StartsWith<"abc", "ac">, false>>,
  Expect<Equal<StartsWith<"abc", "ab">, true>>,
  Expect<Equal<StartsWith<"abc", "abc">, true>>,
  Expect<Equal<StartsWith<"abc", "abcd">, false>>,
  Expect<Equal<StartsWith<"abc", "">, true>>,
  Expect<Equal<StartsWith<"abc", " ">, false>>,
  Expect<Equal<StartsWith<"", "">, true>>,
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/2688/answer
  > View solutions: https://tsch.js.org/2688/solutions
  > More Challenges: https://tsch.js.org
*/
