/*
  5140 - Trunc
  -------
  by jiangshan (@jiangshanmeta) #medium #template-literal

  ### Question

  Implement the type version of ```Math.trunc```, which takes string or number and returns the integer part of a number by removing any fractional digits.

  For example:

  ```typescript
  type A = Trunc<12.34> // 12
  ```

  > View on GitHub: https://tsch.js.org/5140
*/

/* _____________ Your Code Here _____________ */

// 템플릿 리터럴로 한방에 처리 가능할까? number일 경우 우선 string으로 바꿔주고
// type Trunc<T extends number | string, S = `${T}`> = S extends `${infer First}.${infer _}` ? `${First}` : S;

type example = Trunc<0.1>;

// 음... 앞에 0이 안붙는 .3 같은 친구들 처리해줘야겠네
type Trunc<
  T extends number | string,
  S = `${T}`
> = S extends `${infer First}.${infer _}`
  ? First extends "" | "-"
    ? `${First}0`
    : First
  : S;

type example1 = Trunc<".1">;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<Trunc<0.1>, "0">>,
  Expect<Equal<Trunc<0.2>, "0">>,
  Expect<Equal<Trunc<1.234>, "1">>,
  Expect<Equal<Trunc<12.345>, "12">>,
  Expect<Equal<Trunc<-5.1>, "-5">>,
  Expect<Equal<Trunc<".3">, "0">>,
  Expect<Equal<Trunc<"1.234">, "1">>,
  Expect<Equal<Trunc<"-.3">, "-0">>,
  Expect<Equal<Trunc<"-10.234">, "-10">>,
  Expect<Equal<Trunc<10>, "10">>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/5140/answer
  > View solutions: https://tsch.js.org/5140/solutions
  > More Challenges: https://tsch.js.org
*/
