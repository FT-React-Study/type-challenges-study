/*
  4803 - Trim Right
  -------
  by Yugang Cao (@Talljack) #medium #template-literal

  ### Question

  Implement `TrimRight<T>` which takes an exact string type and returns a new string with the whitespace ending removed.

  For example:

  ```ts
  type Trimed = TrimRight<'   Hello World    '> // expected to be '   Hello World'
  ```

  > View on GitHub: https://tsch.js.org/4803
*/

/* _____________ Your Code Here _____________ */

// 템플릿 리터럴로 마지막 글자에 ' '가 들어가는 지 확인 후 들어가면 재귀
type TrimRight<S extends string> = S extends `${infer T}${" " | "\n" | "\t"}`
  ? TrimRight<T>
  : S;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<TrimRight<"str">, "str">>,
  Expect<Equal<TrimRight<"str ">, "str">>,
  Expect<Equal<TrimRight<"str     ">, "str">>,
  Expect<Equal<TrimRight<"     str     ">, "     str">>,
  Expect<Equal<TrimRight<"   foo bar  \n\t ">, "   foo bar">>,
  Expect<Equal<TrimRight<"">, "">>,
  Expect<Equal<TrimRight<"\n\t ">, "">>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/4803/answer
  > View solutions: https://tsch.js.org/4803/solutions
  > More Challenges: https://tsch.js.org
*/
