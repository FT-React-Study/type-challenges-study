/*
  14 - First of Array
  -------
  by Anthony Fu (@antfu) #쉬움 #array

  ### 질문

  배열(튜플) `T`를 받아 첫 원소의 타입을 반환하는 제네릭 `First<T>`를 구현하세요.

  예시:

  ```ts
  type arr1 = ['a', 'b', 'c']
  type arr2 = [3, 2, 1]

  type head1 = First<arr1> // expected to be 'a'
  type head2 = First<arr2> // expected to be 3
  ```

  > GitHub에서 보기: https://tsch.js.org/14/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// 일단 일차적으로 생각할 수 있는 답은
type FirstFirst<T extends any[]> = T[0]

// 이 경우 []를 never로 뱉지 않는다
// []를 never로 뱉게 하는 조건문 형식이 이 문제의 핵심으로 보임
// extends는 타입일 경우 왼쪽에 있는 타입에 오른쪽이 포함된다라고 이해하고 있었는데 정확히는 "할당 가능성(assignability)"을 가지고 있다는 뜻
// 그렇기 때문에 타입일 경우는 포함되어야 하고 리터럴 값일 때는 양쪽이 같아야 한다(=)의 조건부 타입으로 작동한다
// 그런식으로 빈배열 경우에 true를 반환하는 다양한 방식들을 사용하면 된다

type First<T extends any[]> = T extends [] ? never : T[0]

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<First<[3, 2, 1]>, 3>>,
  Expect<Equal<First<[() => 123, { a: string }]>, () => 123>>,
  Expect<Equal<First<[]>, never>>,
  Expect<Equal<First<[undefined]>, undefined>>,
]

type errors = [
  // @ts-expect-error
  First<'notArray'>,
  // @ts-expect-error
  First<{ 0: 'arrayLike' }>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/14/answer/ko
  > 정답 보기: https://tsch.js.org/14/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
