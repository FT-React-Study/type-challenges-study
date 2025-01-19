/*
  268 - If
  -------
  by Pavel Glushkov (@pashutk) #쉬움 #utils

  ### 질문

  조건 `C`, 참일 때 반환하는 타입 `T`, 거짓일 때 반환하는 타입 `F`를 받는 타입 `If`를 구현하세요. `C`는 `true` 또는 `false`이고, `T`와 `F`는 아무 타입입니다.

  예시:

  ```ts
  type A = If<true, 'a', 'b'>  // expected to be 'a'
  type B = If<false, 'a', 'b'> // expected to be 'b'
  ```

  > GitHub에서 보기: https://tsch.js.org/268/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type If<C extends boolean, T, F> =  C extends true ? T : F

// 기존 개념으로도 풀 수 있었다
// C는 boolean에 할당 가능해야 했고, 조건문으로 해서 C가 true일 때는 앞의 T를 false일때는 F를 반환한다
// extends가 뒤에가 타입일 때는 그 하위 집합이어야 하고 리터럴 값일때는 같아야 한다는 것이 단적으로 비교되는 문제

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<If<true, 'a', 'b'>, 'a'>>,
  Expect<Equal<If<false, 'a', 2>, 2>>,
  Expect<Equal<If<boolean, 'a', 2>, 'a' | 2>>,
]

// @ts-expect-error
type error = If<null, 'a', 'b'>

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/268/answer/ko
  > 정답 보기: https://tsch.js.org/268/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
