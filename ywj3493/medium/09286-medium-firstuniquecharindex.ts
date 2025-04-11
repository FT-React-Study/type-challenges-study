/*
  9286 - FirstUniqueCharIndex
  -------
  by jiangshan (@jiangshanmeta) #보통 #string

  ### 질문

  Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

  > GitHub에서 보기: https://tsch.js.org/9286/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type Includes<T extends string, C extends string> = `${C}` extends `${infer _}${T}${infer _}` ? true : false;

type IncludesTest = Includes<"o", 'olee'>;

type FirstUniqueCharIndex<T extends string, H extends string = '', I extends never[] = []> = `${T}` extends `${infer F}${infer R}` ? 
  Includes<F, `${H}${R}`> extends true ?
    FirstUniqueCharIndex<R, `${H}${F}`, [...I, never]> :
    I['length'] :
  -1;

type Test = FirstUniqueCharIndex<'loveleetcode'>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FirstUniqueCharIndex<'leetcode'>, 0>>,
  Expect<Equal<FirstUniqueCharIndex<'loveleetcode'>, 2>>,
  Expect<Equal<FirstUniqueCharIndex<'aabb'>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<''>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<'aaa'>, -1>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/9286/answer/ko
  > 정답 보기: https://tsch.js.org/9286/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
