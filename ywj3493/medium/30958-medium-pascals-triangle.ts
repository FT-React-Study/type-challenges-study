/*
  30958 - Pascal's triangle
  -------
  by Aswin S Vijay (@aswinsvijay) #보통 #array #math

  ### 질문

  Given a number N, construct the Pascal's triangle with N rows.
  [Wikipedia](https://en.wikipedia.org/wiki/Pascal%27s_triangle)

  > GitHub에서 보기: https://tsch.js.org/30958/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type SmallAdder<A extends number, 
  B extends number, 
  AC extends never[] = [], 
  BC extends never[] = []> = 
  AC['length'] extends A ?
    BC['length'] extends B ? 
      [...AC, ...BC]['length'] :
      SmallAdder<A,B,AC,[...BC, never]>:
    SmallAdder<A,B,[...AC, never],BC>;

type NoneToZero<N> = N extends number ? N : 0;

type Pascal<N extends number, 
  I extends never[] = [], 
  J extends never[] = [],
  C extends number[] = [1],
  A extends number[][] = [[1]]> = 
  [...I, never]['length'] extends N ?
    A:
    J['length'] extends [...I, never]['length'] ?
      Pascal<N, [...I, never], [], [1], [...A, C]>:
      Pascal<N, I, [...J, never], [...C, SmallAdder<A[I['length']][J['length']], NoneToZero<A[I['length']][[...J, never]['length']]>>], A>;

type Test = Pascal<13>

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<
    Equal<
      Pascal<1>,
      [
        [1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<3>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<5>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
      ]
    >
  >,
  Expect<
    Equal<
      Pascal<7>,
      [
        [1],
        [1, 1],
        [1, 2, 1],
        [1, 3, 3, 1],
        [1, 4, 6, 4, 1],
        [1, 5, 10, 10, 5, 1],
        [1, 6, 15, 20, 15, 6, 1],
      ]
    >
  >,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/30958/answer/ko
  > 정답 보기: https://tsch.js.org/30958/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
