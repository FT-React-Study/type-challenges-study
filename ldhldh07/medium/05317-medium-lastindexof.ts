/*
  5317 - LastIndexOf
  -------
  by jiangshan (@jiangshanmeta) #보통 #array

  ### 질문

  Implement the type version of ```Array.lastIndexOf```, ```LastIndexOf<T, U>```  takes an Array ```T```, any ```U``` and returns the index of the last ```U``` in Array ```T```

  For example:

  ```typescript
  type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
  type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
  ```

  > GitHub에서 보기: https://tsch.js.org/5317/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type LastIndexOf<T, U, IndexArray extends Array<any> = [], Result extends number = -1> =
  T extends [infer First, ...infer Rest]
    ? (<A>() => A extends First ? 1 : 2) extends
      (<A>() => A extends U ? 1 : 2)
      ? LastIndexOf<Rest, U, [...IndexArray, any], IndexArray['length']>
      : LastIndexOf<Rest, U, [...IndexArray, any], Result>
    : Result

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<LastIndexOf<[1, 2, 3, 2, 1], 2>, 3>>,
  Expect<Equal<LastIndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 7>>,
  Expect<Equal<LastIndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<LastIndexOf<[string, 2, number, 'a', number, 1], number>, 4>>,
  Expect<Equal<LastIndexOf<[string, any, 1, number, 'a', any, 1], any>, 5>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/5317/answer/ko
  > 정답 보기: https://tsch.js.org/5317/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
