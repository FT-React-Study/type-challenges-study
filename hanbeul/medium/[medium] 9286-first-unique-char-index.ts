/*
  9286 - FirstUniqueCharIndex
  -------
  by jiangshan (@jiangshanmeta) #medium #string

  ### Question

  Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

  > View on GitHub: https://tsch.js.org/9286
*/

/* _____________ Your Code Here _____________ */

// C가 T에서 유니크한지 확인
type IsUnique<
  T extends string,
  C extends string,
  Count extends unknown[] = []
> = T extends `${infer First}${infer Rest}`
  ? C extends First
    ? IsUnique<Rest, C, [...Count, unknown]>
    : IsUnique<Rest, C, Count>
  : Count["length"] extends 1
  ? true
  : false;

// 각 글자마다 전체 중복검사하면서, 중복 아니면 인덱스 반환
type FirstUniqueCharIndex<
  T extends string,
  Original extends string = T,
  IndexArr extends unknown[] = []
> = T extends `${infer First}${infer Rest}`
  ? IsUnique<Original, First> extends true
    ? IndexArr["length"]
    : FirstUniqueCharIndex<Rest, Original, [...IndexArr, unknown]>
  : -1;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<Equal<FirstUniqueCharIndex<"leetcode">, 0>>,
  Expect<Equal<FirstUniqueCharIndex<"loveleetcode">, 2>>,
  Expect<Equal<FirstUniqueCharIndex<"aabb">, -1>>,
  Expect<Equal<FirstUniqueCharIndex<"">, -1>>,
  Expect<Equal<FirstUniqueCharIndex<"aaa">, -1>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9286/answer
  > View solutions: https://tsch.js.org/9286/solutions
  > More Challenges: https://tsch.js.org
*/
