/*
  645 - Diff
  -------
  by ZYSzys (@ZYSzys) #보통 #object

  ### 질문

  `O` & `O1`의 차이점인 `객체`를 가져옵니다

  > GitHub에서 보기: https://tsch.js.org/645/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// 시도1
// 접근방법
// A 객체의 키를 순회하며 B 객체에 extends가 안될 경우 빈 객체에 키-값 쌍 추가
// 이후 B 객체의 키를 순회하여 A 객체에 extends가 안될 경우 해당 객체에 키-값 쌍 추가

// 실패 이유: value가 never가 되는건 속성을 없애지는 않음

// type GetDiff<A, B> = { [K in keyof A]: A[K] extends B ? A[K] : never };

// type Diff<O, O1, DiffIntersection = GetDiff<O, O1> & GetDiff<O1, O>> = { [K in keyof DiffIntersection]: DiffIntersection[K]};

// type example1 = Diff<Foo, Bar>;
// {
//     name: never;
//     age: never;
//     gender: never;
// }

// 시도2(정답)
// 1번과 접근 방식은 동일, as(key-remapping)을 활용해 value가 아니라 key값을 never 처리하도록 변경
type GetDiff<A, B> = { [K in keyof A as K extends keyof B ? never : K]: A[K] };

type Diff<O, O1, DiffIntersection = GetDiff<O, O1> & GetDiff<O1, O>> = {
  [K in keyof DiffIntersection]: DiffIntersection[K];
};

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type Foo = {
  name: string;
  age: string;
};
type Bar = {
  name: string;
  age: string;
  gender: number;
};
type Coo = {
  name: string;
  gender: number;
};

type cases = [
  Expect<Equal<Diff<Foo, Bar>, { gender: number }>>,
  Expect<Equal<Diff<Bar, Foo>, { gender: number }>>,
  Expect<Equal<Diff<Foo, Coo>, { age: string; gender: number }>>,
  Expect<Equal<Diff<Coo, Foo>, { age: string; gender: number }>>,
];

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/645/answer/ko
  > 정답 보기: https://tsch.js.org/645/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
