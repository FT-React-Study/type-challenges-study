/*
  4499 - Chunk
  -------
  by キリサメ qianxi (@qianxi0410) #보통 #tuple

  ### 질문

  Do you know `lodash`? `Chunk` is a very useful function in it, now let's implement it.
  `Chunk<T, N>` accepts two required type parameters, the `T` must be a `tuple`, and the `N` must be an `integer >=1`

  ```ts
  type exp1 = Chunk<[1, 2, 3], 2> // expected to be [[1, 2], [3]]
  type exp2 = Chunk<[1, 2, 3], 4> // expected to be [[1, 2, 3]]
  type exp3 = Chunk<[1, 2, 3], 1> // expected to be [[1], [2], [3]]
  ```

  > GitHub에서 보기: https://tsch.js.org/4499/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

// type SimpleAdder<N extends number, C extends never[] = []> = C['length'] extends N ? [...C, never]['length'] : SimpleAdder<N, [...C, never]>; 

// /**
//  * 
//  * N: 커널 크기
//  * Curr: 중간 반복 인덱스
//  * CurrAcc: 중간 반복 누적 배열
//  * I: 전체 인덱스
//  * Total: 최종 리턴 타입
//  */
// type SliceArray<T extends unknown[], 
//   N extends number, 
//   Curr extends number = 0, 
//   CurrAcc extends unknown[] = [],
//   I extends number = 0, 
//   Total extends unknown[] = []
// > = 
//   // 인덱스 순회
//   I extends T['length'] ? 
//     // 종료
//     Total :
//       // I 가 아직 안 끝났을 때, 반복 인덱스 확인
//       Curr extends N ?
//         // 반복 인덱스가 다 도달했을 경우
//         SliceArray<T, N, 0, [], I, [...Total, CurrAcc]> :
//           // 반복 인덱스가 다 도달하지 않았을 때, T 순회
//           T extends [infer First, ...infer Rest] ?
//             SliceArray<Rest, N, SimpleAdder<Curr>, [...CurrAcc, First], SimpleAdder<I>, Total> :
//             Total;

// type Chunk<T extends unknown[], N extends number> = SliceArray<T, N>;

type Chunk<
  T extends unknown[],
  N extends number,
  Acc extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? Acc['length'] extends N
    ? [Acc, ...Chunk<T, N>]
    : Chunk<Rest, N, [...Acc, First]>
  : Acc extends []
    ? []
    : [Acc];

type Test = Chunk<[1, 2, 3], 2>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Chunk<[], 1>, []>>,
  Expect<Equal<Chunk<[1, 2, 3], 1>, [[1], [2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3], 2>, [[1, 2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 2>, [[1, 2], [3, 4]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 5>, [[1, 2, 3, 4]]>>,
  Expect<Equal<Chunk<[1, true, 2, false], 2>, [[1, true], [2, false]]>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/4499/answer/ko
  > 정답 보기: https://tsch.js.org/4499/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
