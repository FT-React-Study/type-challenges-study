/*
  16259 - ToPrimitive
  -------
  by 前端子鱼 (@mwc) #보통

  ### 질문

  Convert a property of type literal (label type) to a primitive type.

  For example

  ```typescript
  type X = {
    name: 'Tom',
    age: 30,
    married: false,
    addr: {
      home: '123456',
      phone: '13111111111'
    }
  }

  type Expected = {
    name: string,
    age: number,
    married: boolean,
    addr: {
      home: string,
      phone: string
    }
  }
  type Todo = ToPrimitive<X> // should be same as `Expected`
  ```

  > GitHub에서 보기: https://tsch.js.org/16259/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type ArrayToPrimitive<T extends any[]> =
  T extends [infer First, ...infer Rest]
    ? [ToPrimitive<First>, ...ArrayToPrimitive<Rest>]
    : [];

type ToPrimitive<T> =
  T extends string 
    ? string 
    : T extends number 
      ? number 
      : T extends boolean 
        ? boolean 
        : T extends Function 
          ? Function 
          : T extends any[]
            ? ArrayToPrimitive<T>
            : T extends object
              ? { [K in keyof T]: ToPrimitive<T[K]> }
              : T;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type PersonInfo = {
  name: 'Tom'
  age: 30
  married: false
  addr: {
    home: '123456'
    phone: '13111111111'
  }
  hobbies: ['sing', 'dance']
  readonlyArr: readonly ['test']
  fn: () => any
}

type ExpectedResult = {
  name: string
  age: number
  married: boolean
  addr: {
    home: string
    phone: string
  }
  hobbies: [string, string]
  readonlyArr: readonly [string]
  fn: Function
}

type cases = [
  Expect<Equal<ToPrimitive<PersonInfo>, ExpectedResult>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/16259/answer/ko
  > 정답 보기: https://tsch.js.org/16259/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
