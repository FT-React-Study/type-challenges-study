/*
  9 - Deep Readonly
  -------
  by Anthony Fu (@antfu) #보통 #readonly #object-keys #deep

  ### 질문

  객체의 프로퍼티와 모든 하위 객체를 재귀적으로 읽기 전용으로 설정하는 제네릭 `DeepReadonly<T>`를 구현하세요.

  이 챌린지에서는 타입 파라미터 `T`를 객체 타입으로 제한하고 있습니다. 객체뿐만 아니라 배열, 함수, 클래스 등 가능한 다양한 형태의 타입 파라미터를 사용하도록 도전해 보세요.

  예시:

  ```ts
  type X = {
    x: {
      a: 1
      b: 'hi'
    }
    y: 'hey'
  }

  type Expected = {
    readonly x: {
      readonly a: 1
      readonly b: 'hi'
    }
    readonly y: 'hey'
  }

  type Todo = DeepReadonly<X> // should be same as `Expected`
  ```

  > GitHub에서 보기: https://tsch.js.org/9/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// // 첫시도
// type DeepReadonly<T> = {
//     readonly [P in keyof T] : T[P] extends Object ? DeepReadonly<T[P]> : T[P]
// }

// // 첫시도 gpt 디버깅

// type DeepReadonly<T> = {
//     readonly [P in keyof T]: T[P] extends (...args: any[]) => any
//       ? T[P] // 함수 타입은 그대로 둔다
//       : T[P] extends object // 객체 타입인지 확인 (null 제외)
//       ? DeepReadonly<T[P]> // 객체라면 재귀적으로 처리
//       : T[P]; // 원시 타입은 그대로 둔다
//   }

// 두번째시도
type DeepReadonly<T> = keyof T extends never 
? T
: { readonly [P in keyof T] : DeepReadonly<T[P]> }

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<DeepReadonly<X1>, Expected1>>,
  Expect<Equal<DeepReadonly<X2>, Expected2>>,
]

type X1 = {
  a: () => 22
  b: string
  c: {
    d: boolean
    e: {
      g: {
        h: {
          i: true
          j: 'string'
        }
        k: 'hello'
      }
      l: [
        'hi',
        {
          m: ['hey']
        },
      ]
    }
  }
}

type X2 = { a: string } | { b: number }

type Expected1 = {
  readonly a: () => 22
  readonly b: string
  readonly c: {
    readonly d: boolean
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true
          readonly j: 'string'
        }
        readonly k: 'hello'
      }
      readonly l: readonly [
        'hi',
        {
          readonly m: readonly ['hey']
        },
      ]
    }
  }
}

type Expected2 = { readonly a: string } | { readonly b: number }

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/9/answer/ko
  > 정답 보기: https://tsch.js.org/9/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
