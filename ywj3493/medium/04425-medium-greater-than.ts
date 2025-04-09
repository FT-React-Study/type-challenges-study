/*
  4425 - Greater Than
  -------
  by ch3cknull (@ch3cknull) #보통 #array

  ### 질문

  In This Challenge, You should implement a type `GreaterThan<T, U>` like `T > U`

  Negative numbers do not need to be considered.

  For example

  ```ts
  GreaterThan<2, 1> //should be true
  GreaterThan<1, 1> //should be false
  GreaterThan<10, 100> //should be false
  GreaterThan<111, 11> //should be true
  ```

  Good Luck!

  > GitHub에서 보기: https://tsch.js.org/4425/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type SmallMinusOne<A extends number, Acc extends never[] = []> = Acc['length'] extends A ? 
  Acc extends [infer _, ...infer Rest] ? 
    Rest['length'] : 
    never : 
  SmallMinusOne<A, [...Acc, never]>;

type SmallGreaterThan<T extends number, U extends number> = T extends 0 ? 
  // T == 0 
  U extends 0 ? 
    // 둘 다 0
    false : 
  // T 는 0, U 는 0이 아닐 때
  false:
  // T != 0
  U extends 0 ?
    // U 만 0
    true:
  // 둘 다 0 이 아닐 때
  SmallGreaterThan<SmallMinusOne<T>, SmallMinusOne<U>>;

type SmallGreaterThanTest = SmallGreaterThan<5,3>;

type NumberToTuple<T extends number> = `${T}` extends `${infer First extends number}${infer Rest extends number}` ? [First, ...NumberToTuple<Rest>] : [T];

type NumberToTupleTest = NumberToTuple<234>;

// tuple 인 타입 순서대로 크기 검사하기
type GreaterThanSquentially<T extends number[], U extends number[]> = 
  // 자리수 검사
  SmallGreaterThan<T['length'], U['length']> extends true ? true :
    // 배열 검사
    T extends [infer TFirst extends number, ...infer TRest extends number[]] ? U extends [infer UFirst extends number, ...infer URest extends number[]] ?
      // 첫번째 자리 검사
      SmallGreaterThan<TFirst, UFirst> extends true ? true:
        // 아니면 다음 자리 검사
        GreaterThanSquentially<TRest, URest>:
      // 여기로는 빠질리 없어야한다.
      never:
    // 자리수 짧음
    false;

type GreaterThanSquentiallyTest = GreaterThanSquentially<[1,2,4], [1,2,3]>;

// 0. 두 수를 비교하기 좋게 전처리하기 위해 숫자를 튜플로 변경
// 1. 자리수 우선 비교
// 2. 자리수가 같으면, 앞자리부터 비교
type GreaterThan<T extends number, U extends number> = GreaterThanSquentially<NumberToTuple<T>, NumberToTuple<U>>;

type Test = GreaterThan<4,5>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<GreaterThan<1, 0>, true>>,
  Expect<Equal<GreaterThan<5, 4>, true>>,
  Expect<Equal<GreaterThan<4, 5>, false>>,
  Expect<Equal<GreaterThan<0, 0>, false>>,
  Expect<Equal<GreaterThan<10, 9>, true>>,
  Expect<Equal<GreaterThan<20, 20>, false>>,
  Expect<Equal<GreaterThan<10, 100>, false>>,
  Expect<Equal<GreaterThan<111, 11>, true>>,
  Expect<Equal<GreaterThan<1234567891011, 1234567891010>, true>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/4425/answer/ko
  > 정답 보기: https://tsch.js.org/4425/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
