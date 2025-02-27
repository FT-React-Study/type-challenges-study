/*
  949 - AnyOf
  -------
  by null (@kynefuk) #보통 #array

  ### 질문

  Implement Python liked `any` function in the type system. A type takes the Array and returns `true` if any element of the Array is true. If the Array is empty, return `false`.

  Python의 `any` function을 타입 시스템으로 구현하세요

  배열을 사용하고 배열의 요소가 참이면 `true`를 반환합니다. 배열이 비어 있으면 `false`를 반환합니다

  예시:

  ```ts
  type Sample1 = AnyOf<[1, "", false, [], {}]> // expected to be true.
  type Sample2 = AnyOf<[0, "", false, [], {}]> // expected to be false.
  ```

  > GitHub에서 보기: https://tsch.js.org/949/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// 시도1
// 접근 방법
// 빈 배열인지 확인한 후, 빈 배열이 아닐 경우 재귀를 이용해 각 요소를 순회하며, 단 한 번이라도 false 값을 가질 경우 false 리턴
// false 값인지는 따로 객체를 만들어 확인

// type IsFalse = 0 | '' | false | [] | {} | undefined | null;
// type AnyOf<T extends readonly any[]> = T extends []
//   ? false
//   : T extends [infer First, ...infer Rest]
//     ? First extends IsFalse
//       ? AnyOf<Rest>
//       : true
//     : false;

// 오답이유
// IsFalse에 들어있는 {}가 모든 객체를 false로 잡아버림

// 시도2
// emptyObject를 해결해보자

type IsEmptyObject<T> = keyof T extends never ? true : false;
type IsFalse<T> = T extends 0 | "" | false | [] | undefined | null
  ? true
  : T extends object
    ? IsEmptyObject<T>
    : false;

type AnyOf<T extends readonly any[]> = T extends []
  ? false
  : T extends [infer First, ...infer Rest]
    ? IsFalse<First> extends true
      ? AnyOf<Rest>
      : true
    : false;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type cases = [
  Expect<
    Equal<AnyOf<[1, "test", true, [1], { name: "test" }, { 1: "test" }]>, true>
  >,
  Expect<Equal<AnyOf<[1, "", false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "test", false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [], { name: "test" }]>, true>>,
  Expect<Equal<AnyOf<[0, "", false, [], { 1: "test" }]>, true>>,
  Expect<
    Equal<AnyOf<[0, "", false, [], { name: "test" }, { 1: "test" }]>, true>
  >,
  Expect<Equal<AnyOf<[0, "", false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>,
];

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/949/answer/ko
  > 정답 보기: https://tsch.js.org/949/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
