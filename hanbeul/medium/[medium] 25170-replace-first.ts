/*
  25170 - Replace First
  -------
  by George Flinn (@ProjectFlinn) #medium

  ### Question

  Implement the type ReplaceFirst<T, S, R> which will replace the first occurrence of S in a tuple T with R. If no such S exists in T, the result should be T.

  > View on GitHub: https://tsch.js.org/25170
*/

/* _____________ Your Code Here _____________ */

// 한글자씩 순회하면서 S와 같은 값이 나오면 R로 대체
// 원래 IsEqual로 비교했다가 'two'와 string 이슈 해결 안되어 extends로 처리
type ReplaceFirst<
  T extends readonly unknown[],
  S,
  R,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? First extends S
    ? [...Result, R, ...Rest]
    : ReplaceFirst<Rest, S, R, [...Result, First]>
  : Result;

type example = ReplaceFirst<[1, "two", 3], string, 2>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<ReplaceFirst<[1, 2, 3], 3, 4>, [1, 2, 4]>>,
  Expect<Equal<ReplaceFirst<["A", "B", "C"], "C", "D">, ["A", "B", "D"]>>,
  Expect<
    Equal<ReplaceFirst<[true, true, true], true, false>, [false, true, true]>
  >,
  Expect<
    Equal<
      ReplaceFirst<[string, boolean, number], boolean, string>,
      [string, string, number]
    >
  >,
  Expect<Equal<ReplaceFirst<[1, "two", 3], string, 2>, [1, 2, 3]>>,
  Expect<
    Equal<
      ReplaceFirst<["six", "eight", "ten"], "eleven", "twelve">,
      ["six", "eight", "ten"]
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/25170/answer
  > View solutions: https://tsch.js.org/25170/solutions
  > More Challenges: https://tsch.js.org
*/
