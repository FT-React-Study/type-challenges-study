/*
  25270 - Transpose
  -------
  by Apollo Wayne (@Shinerising) #보통 #array #math

  ### 질문

  The transpose of a matrix is an operator which flips a matrix over its diagonal; that is, it switches the row and column indices of the matrix A by producing another matrix, often denoted by A<sup>T</sup>.

  ```ts
  type Matrix = Transpose <[[1]]>; // expected to be [[1]]
  type Matrix1 = Transpose <[[1, 2], [3, 4]]>; // expected to be [[1, 3], [2, 4]]
  type Matrix2 = Transpose <[[1, 2, 3], [4, 5, 6]]>; // expected to be [[1, 4], [2, 5], [3, 6]]
  ```

  > GitHub에서 보기: https://tsch.js.org/25270/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type Transpose<M extends number[][], 
  I extends never[] = [],
  J extends never[] = [],
  T extends number[][] = [], 
  C extends number[] = [],
  IE = M['length'],
  JE = M[0]['length']> = 
  J['length'] extends JE ?
    I['length'] extends IE ?
      // 종료
      T:
      // J 는 종료, I 는 아직 미종료
      Transpose<M, [...I, never], J, T, [...C, M[I['length']][J['length']]]>:
    I['length'] extends IE ?
      // J 미종료, I 종료
      Transpose<M, [], [...J, never], [...T, C], []>:
      // 둘다 미종료
      Transpose<M, [...I, never], J, T, [...C, M[I['length']][J['length']]]>;

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Transpose<[]>, []>>,
  Expect<Equal<Transpose<[[1]]>, [[1]]>>,
  Expect<Equal<Transpose<[[1, 2]]>, [[1], [2]]>>,
  Expect<Equal<Transpose<[[1, 2], [3, 4]]>, [[1, 3], [2, 4]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6]]>, [[1, 4], [2, 5], [3, 6]]>>,
  Expect<Equal<Transpose<[[1, 4], [2, 5], [3, 6]]>, [[1, 2, 3], [4, 5, 6]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>, [[1, 4, 7], [2, 5, 8], [3, 6, 9]]>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/25270/answer/ko
  > 정답 보기: https://tsch.js.org/25270/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
