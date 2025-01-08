/*
  11 - Tuple to Object
  -------
  by sinoon (@sinoon) #쉬움 #object-keys

  ### 질문

  배열(튜플)을 받아, 각 원소의 값을 key/value로 갖는 오브젝트 타입을 반환하는 타입을 구현하세요.

  예시:

  ```ts
  const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

  type result = TupleToObject<typeof tuple> // expected { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
  ```

  > GitHub에서 보기: https://tsch.js.org/11/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// keyof T가 객체 형태의 T의 키값들을 유니온 타입으로 반환하는거라면
// T[number]는 튜플 형태의 T의 값들을 유니온 타입으로 반환
// [P in T] 형태는 유니온 형태의 타입을 매핑하는 문밥이기 때문에 유니온 타입으로 만들어주는것

// 이 문제에서 요구하는 에러는 튜플의 값이 객체의 키값이 될 수 있는 형태가 아닌 경우 에러를 발생시켜야 하기 때문
type TupleToObjectAny<T extends readonly any[]> = {
  [P in T[number]]: P
}
// 하지만 이 형태에서는 에러가 나야 하는 부분에 에러가 나지 않음
// type PropertyKey = string | number | symbol
// PropertyKey타입 - 객체의 키값이 될 수 있는 타입들
// extends로 객체의 키값이 될 수 있는 타입들로 제한해준다

type TupleToObject<T extends readonly PropertyKey[]> = {
  [P in T[number]]: P
}



/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
const tupleNumber = [1, 2, 3, 4] as const
const sym1 = Symbol(1)
const sym2 = Symbol(2)
const tupleSymbol = [sym1, sym2] as const
const tupleMix = [1, '2', 3, '4', sym1] as const

type cases = [
  Expect<Equal<TupleToObject<typeof tuple>, { 'tesla': 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y' }>>,
  Expect<Equal<TupleToObject<typeof tupleNumber>, { 1: 1, 2: 2, 3: 3, 4: 4 }>>,
  Expect<Equal<TupleToObject<typeof tupleSymbol>, { [sym1]: typeof sym1, [sym2]: typeof sym2 }>>,
  Expect<Equal<TupleToObject<typeof tupleMix>, { 1: 1, '2': '2', 3: 3, '4': '4', [sym1]: typeof sym1 }>>,
]

// @ts-expect-error
type error = TupleToObject<[[1, 2], {}]>

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/11/answer/ko
  > 정답 보기: https://tsch.js.org/11/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
