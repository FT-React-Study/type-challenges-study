/*
  21104 - FindAll
  -------
  by tunamagur0 (@tunamagur0) #medium #template-literal #string

  ### Question

  Given a pattern string P and a text string T, implement the type `FindAll<T, P>` that returns an Array that contains all indices (0-indexed) from T where P matches.

  > View on GitHub: https://tsch.js.org/21104
*/

/* _____________ Your Code Here _____________ */

// 템플릿 리터럴로 존재확인 후, 존재하면 index 구해줌
// index는 어떻게 구할까? left 문자열의 길이를 재서 리턴하자
// 이후 P 뒷쪽의 rest 문자열을 재귀 처리
// type GetIndex<T extends string, LengthArr extends unknown[] = []> =
//   T extends `${infer _}${infer Rest}`
//     ? GetIndex<Rest, [unknown, ...LengthArr]>
//     : LengthArr['length'];

// type FindAll<T extends string, P extends string> =
//   T extends `${infer Left}${P}${infer Rest}`
//     ? [GetIndex<Left>, ...FindAll<Rest, P>]
//     : [];

// 뒷쪽의 rest 문자열만 재귀처리하니까, 두번째 요소에 대해서는 뒷쪽의 index를 구함
// 누적으로 더할 방법은 없을까?
// GetIndex에서 리턴하는건 그냥 unknown[]이고, 그걸 누적해보면서 가져가면 어떨까
// 근데 아무튼 rest로 분리하게 되면, AAAA, AA를 통과를 못시킬듯

// 그냥 하나씩 돌면서 확인하자
type FindAll<
  T extends string,
  P extends string,
  IndexArr extends unknown[] = []
> = T extends `${infer TFirst}${infer TRest}`
  ? P extends `${TFirst}${infer PRest}`
    ? TRest extends `${PRest}${infer _}`
      ? [IndexArr["length"], ...FindAll<TRest, P, [...IndexArr, unknown]>]
      : [...FindAll<TRest, P, [...IndexArr, unknown]>]
    : [...FindAll<TRest, P, [...IndexArr, unknown]>]
  : [];

type example = FindAll<"Collection of TypeScript type challenges", "pe">;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<
    Equal<FindAll<"Collection of TypeScript type challenges", "Type">, [14]>
  >,
  Expect<
    Equal<FindAll<"Collection of TypeScript type challenges", "pe">, [16, 27]>
  >,
  Expect<Equal<FindAll<"Collection of TypeScript type challenges", "">, []>>,
  Expect<Equal<FindAll<"", "Type">, []>>,
  Expect<Equal<FindAll<"", "">, []>>,
  Expect<Equal<FindAll<"AAAA", "A">, [0, 1, 2, 3]>>,
  Expect<Equal<FindAll<"AAAA", "AA">, [0, 1, 2]>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/21104/answer
  > View solutions: https://tsch.js.org/21104/solutions
  > More Challenges: https://tsch.js.org
*/
