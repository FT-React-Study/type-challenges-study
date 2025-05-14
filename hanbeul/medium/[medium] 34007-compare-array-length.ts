/*
  34007 - Compare Array Length
  -------
  by alviner (@ScriptBloom) #medium #recursion #array

  ### Question

  Implement `CompareArrayLength` to compare two array length(T & U).

  If length of T array is greater than U, return 1;
  If length of U array is greater than T, return -1;
  If length of T array is equal to U, return 0.

  > View on GitHub: https://tsch.js.org/34007
*/

/* _____________ Your Code Here _____________ */

// 만약 길이가 같으면 0 리턴
// 그게 아니면 각자 infer로 하나씩 추출
// 먼저 길이가 0이 되는지 확인
type CompareArrayLength<
  T extends any[],
  U extends any[]
> = T["length"] extends U["length"]
  ? 0
  : T extends [infer _, ...infer TRest]
  ? U extends [infer _, ...infer URest]
    ? CompareArrayLength<TRest, URest>
    : 1
  : -1;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<CompareArrayLength<[1, 2, 3, 4], [5, 6]>, 1>>,
  Expect<Equal<CompareArrayLength<[1, 2], [3, 4, 5, 6]>, -1>>,
  Expect<Equal<CompareArrayLength<[], []>, 0>>,
  Expect<Equal<CompareArrayLength<[1, 2, 3], [4, 5, 6]>, 0>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/34007/answer
  > View solutions: https://tsch.js.org/34007/solutions
  > More Challenges: https://tsch.js.org
*/
