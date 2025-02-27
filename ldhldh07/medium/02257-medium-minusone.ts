/*
  2257 - MinusOne
  -------
  by Mustafo Faiz (@fayzzzm) #보통 #math

  ### 질문

  Given a number (always positive) as a type. Your type should return the number decreased by one.

  For example:

  ```ts
  type Zero = MinusOne<1> // 0
  type FiftyFour = MinusOne<55> // 54
  ```

  > GitHub에서 보기: https://tsch.js.org/2257/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type MinusOne<T extends number, LastNumber extends string = `${T}`, RestNumber extends string = "", B extends any[] = []> =
  LastNumber extends `${infer First}${infer Rest}`
    ? Rest extends "" 
      ? `${B['length']}` extends LastNumber 
        ? B extends [infer _One, ...infer Rest] 
          ? `${RestNumber}${Rest['length']}` extends `${infer N extends number}` 
            ? N 
            : never
          : 0
        : MinusOne<T, LastNumber, RestNumber, [0, ...B]> 
      : MinusOne<T, Rest, `${RestNumber}${First}`, [0, ...B]> 
    : never;

  
    // ? B extends [infer _One, ...infer Rest]
    //   ? Rest['length']
    //   : 0
    // : MinusOne<T, [0, ...B]>

type a = MinusOne<55>

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<MinusOne<1>, 0>>,
  Expect<Equal<MinusOne<55>, 54>>,
  Expect<Equal<MinusOne<3>, 2>>,
  Expect<Equal<MinusOne<100>, 99>>,
  Expect<Equal<MinusOne<1101>, 1100>>,
  Expect<Equal<MinusOne<9_007_199_254_740_992>, 9_007_199_254_740_991>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/2257/answer/ko
  > 정답 보기: https://tsch.js.org/2257/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
