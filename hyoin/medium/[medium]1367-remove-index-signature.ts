/*
  1367 - Remove Index Signature
  -------
  by hiroya iizuka (@hiroyaiizuka) #보통 #object-keys

  ### 질문

  객체 유형에서 인덱스 시그니처를 제외하는 `RemoveIndexSignature<T>`를 구현하세요

  예시:

  ```ts
  type Foo = {
    [key: string]: any
    foo(): void
  }

  type A = RemoveIndexSignature<Foo> // expected { foo(): void }
  ```

  > GitHub에서 보기: https://tsch.js.org/1367/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type IsTemplateLiteral<T> = T extends `${infer _}${number}${infer _}` ? true : false;


type ProperyTypeCheck<T> = string extends T
  ? true
  : symbol extends T
    ? true
    : number extends T
      ? true
      : IsTemplateLiteral<T> extends true
        ? true
        : false

type RemoveIndexSignature<T extends object> = {
  [P in keyof T as ProperyTypeCheck<P> extends true
    ? never
    : P
  ]: T[P]
}

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type Foo = {
  [key: string]: any
  foo(): void
}

type Bar = {
  [key: number]: any
  bar(): void
  0: string
}

const foobar = Symbol('foobar')
type FooBar = {
  [key: symbol]: any
  [foobar](): void
}

type Baz = {
  bar(): void
  baz: string
}

type cases = [
  Expect<Equal<RemoveIndexSignature<Foo>, { foo(): void }>>,
  Expect<Equal<RemoveIndexSignature<Bar>, { bar(): void, 0: string }>>,
  Expect<Equal<RemoveIndexSignature<FooBar>, { [foobar](): void }>>,
  Expect<Equal<RemoveIndexSignature<Baz>, { bar(): void, baz: string }>>,
]

type IndexTest = {
    [x: `${string}11`] : string
    s : string
  }
  
type test= RemoveIndexSignature<IndexTest>

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/1367/answer/ko
  > 정답 보기: https://tsch.js.org/1367/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
