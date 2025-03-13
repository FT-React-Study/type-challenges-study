/*
  3243 - FlattenDepth
  -------
  by jiangshan (@jiangshanmeta) #보통 #array

  ### 질문

  Recursively flatten array up to depth times.

  For example:

  ```typescript
  type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
  type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
  ```

  If the depth is provided, it's guaranteed to be positive integer.

  > GitHub에서 보기: https://tsch.js.org/3243/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// type Flatten<T extends unknown[]> = T extends [infer First, ...infer Rest] ? First extends [...infer Inner] ? [...Inner, ...Flatten<Rest>] : [First, ...Flatten<Rest>] : T;

// type FlattenTest1 = Flatten<[1, 2, 3]>;
// type FlattenTest2 = Flatten<[1, [2], [[3]]]>;

// type Builder<T extends unknown[], Depth extends number, Acc extends any[] = []> = Acc['length'] extends Depth ? T : Builder<Flatten<T>, Depth, [...Acc, never]>;

// type FlattenDepth<T extends unknown[], Depth extends number = 1> = Builder<T, Depth>;

// type Test1 = FlattenDepth<[1, [[2]]]>;
// type Test2 = FlattenDepth<[1, 2, [3, 4], [[5]]], 2>;

type Builder<T extends unknown[], Depth extends number, Acc extends never[] = []> = Acc['length'] extends Depth 
  ? T 
    : T extends [infer First, ...infer Rest] 
    ? First extends any[] 
      ? [...Builder<First, Depth, [...Acc, never]>, ...Builder<Rest, Depth, Acc>]
      : [First, ...Builder<Rest, Depth, Acc>]
    :T;

type FlattenDepth<T extends unknown[], Depth extends number = 1> = Builder<T, Depth>;

type Test1 = FlattenDepth<[1, [[2]]]>;
type Test2 = FlattenDepth<[1, 2, [3, 4], [[5]]], 2>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/3243/answer/ko
  > 정답 보기: https://tsch.js.org/3243/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
