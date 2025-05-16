/*
  35045 - Longest Common Prefix
  -------
  by Tom Cleary (@thomcleary) #medium

  ### Question

  ### Longest Common Prefix

  Write a type, `LongestCommonPrefix` that returns the longest common prefix string amongst a tuple of strings.

  If there is no common prefix, return an empty string `""`.

  ```ts
  type Common = LongestCommonPrefix<["flower", "flow", "flight"]>
  //   ?^ "fl"

  type Uncommon = LongestCommonPrefix<["dog", "racecar", "race"]>
  //   ?^ ""
  ```
  Inspired by [LeetCode 14. Longest Common Prefix](https://leetcode.com/problems/longest-common-prefix/description/)

  > View on GitHub: https://tsch.js.org/35045
*/

/* _____________ Your Code Here _____________ */

// Step 1: 모든 문자열이 prefix P를 만족하는지 확인
type AllMatch<T extends string[], P extends string> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? First extends `${P}${string}`
    ? AllMatch<Rest, P>
    : false
  : true;

// Step 2: 첫 번째 문자열을 기준으로 prefix를 점진적으로 확장
type LongestCommonPrefix<
  T extends string[],
  First extends string = T extends [infer F extends string, ...any] ? F : "",
  Prefix extends string = ""
> = First extends `${infer C}${infer Rest}`
  ? AllMatch<T, `${Prefix}${C}`> extends true
    ? LongestCommonPrefix<T, Rest, `${Prefix}${C}`>
    : Prefix
  : Prefix;

type example1 = LongestCommonPrefix<["flower", "flow", "flight"]>;
type example2 = LongestCommonPrefix<["abc", "abcd", "abcde"]>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<LongestCommonPrefix<["flower", "flow", "flight"]>, "fl">>,
  Expect<Equal<LongestCommonPrefix<["dog", "racecar", "race"]>, "">>,
  Expect<Equal<LongestCommonPrefix<["", "", ""]>, "">>,
  Expect<Equal<LongestCommonPrefix<["a", "", ""]>, "">>,
  Expect<Equal<LongestCommonPrefix<["", "a", ""]>, "">>,
  Expect<Equal<LongestCommonPrefix<["", "", "a"]>, "">>,
  Expect<Equal<LongestCommonPrefix<["a", "a", ""]>, "">>,
  Expect<Equal<LongestCommonPrefix<["a", "", "a"]>, "">>,
  Expect<Equal<LongestCommonPrefix<["", "a", "a"]>, "">>,
  Expect<Equal<LongestCommonPrefix<["a", "a", "a"]>, "a">>,
  Expect<Equal<LongestCommonPrefix<["abc", "abcd", "abcde"]>, "abc">>,
  Expect<Equal<LongestCommonPrefix<[" ", " ", " "]>, " ">>,
  Expect<
    Equal<
      LongestCommonPrefix<["type-challenges", "type-hero", "typescript"]>,
      "type"
    >
  >
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/35045/answer
  > View solutions: https://tsch.js.org/35045/solutions
  > More Challenges: https://tsch.js.org
*/
