/*
  9286 - FirstUniqueCharIndex
  -------
  by jiangshan (@jiangshanmeta) #medium #string

  ### Question

  Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

  > View on GitHub: https://tsch.js.org/9286
*/

/* _____________ Your Code Here _____________ */

type UniqueCharUnion<
T extends string, 
Chars extends string = '', 
Reapted extends string = ''> = T extends `${infer First}${infer Rest}`
  ? First extends Chars
    ? UniqueCharUnion<Rest, Chars, Reapted|First>
    : UniqueCharUnion<Rest, Chars|First, Reapted>
  : Exclude<Chars, Reapted>

type FirstUniqueCharIndex<
T extends string, 
Unique extends string = UniqueCharUnion<T>, 
Arr extends unknown[] = []> = T extends `${infer First}${infer Rest}`
  ? First extends Unique
    ? Arr['length']
    : FirstUniqueCharIndex<Rest, Unique, [...Arr, unknown]>
  : -1

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FirstUniqueCharIndex<'leetcode'>, 0>>,
  Expect<Equal<FirstUniqueCharIndex<'loveleetcode'>, 2>>,
  Expect<Equal<FirstUniqueCharIndex<'aabb'>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<''>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<'aaa'>, -1>>,
]

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/9286/answer
  > View solutions: https://tsch.js.org/9286/solutions
  > More Challenges: https://tsch.js.org
*/
