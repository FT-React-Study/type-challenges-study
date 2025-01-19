/*
  189 - Awaited
  -------
  by Maciej Sikora (@maciejsikora) #쉬움 #promise #built-in

  ### 질문

  Promise와 같은 타입에 감싸인 타입이 있을 때, 안에 감싸인 타입이 무엇인지 어떻게 알 수 있을까요?

  예시: 들어 `Promise<ExampleType>`이 있을 때, `ExampleType`을 어떻게 얻을 수 있을까요?

  ```ts
  type ExampleType = Promise<string>

  type Result = MyAwaited<ExampleType> // string
  ```

  > 출처: [original article](https://dev.to/macsikora/advanced-typescript-exercises-question-1-45k4) by [@maciejsikora](https://github.com/maciejsikora)

  > GitHub에서 보기: https://tsch.js.org/189/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type MyAwaitedFirst<T> = T extends Promise<infer U> ? U : T

// infer는 특정 타입을 추론하도록 하는 것
// 단계별로 이해한 것은 일단 T extends SomeType<infer U>인 상태에서 T에 대해서 추론한다.
// 일단 조건부기 때문에 조건부 true/false로 가르는 기준은 기본적으로 SomeType과 T가 '구조적으로 타입이 호환'이 되느냐? 그래서 아닌경우 Promise가 끝나고 최종 타입인 것이기 때문에 그걸 반환
// 먼저 Promise로 호환이 되어 true가 된 경우인데 그런 경우 그 추론한 타입은 변수에 할당해서 그 조건문 내에 쓸 수 있다.
// 그래서 infer로 추론한 타입을 U에 할당해서 true인 경우 그 U로 반환할 수 있다

// 하지만 위 코드를 유지했을 경우 Promise가 중첩된 Z, Z1 타입과 promise처럼 동작하지만 Promise 타입은 아닌 T 타입은 오류가 난다

type MyAwaitedSecond<T> = T extends Promise<infer U> ? MyAwaitedSecond<U> : T

// 타입 연산도 재귀가 가능하다는 점


type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T

//PromiseLike로 thenable 객체까지 포함

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>
type T = { then: (onfulfilled: (arg: number) => any) => any }

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>,
  Expect<Equal<MyAwaited<T>, number>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/189/answer/ko
  > 정답 보기: https://tsch.js.org/189/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
