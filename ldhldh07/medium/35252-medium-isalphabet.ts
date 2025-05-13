/*
  35252 - IsAlphabet
  -------
  by Kanon (@ysknsid25) #보통

  ### 질문

  Determine if the given letter is an alphabet.

  > GitHub에서 보기: https://tsch.js.org/35252/ko
*/

/* _____________ 여기에 코드 입력 _____________ */

type IsAlphabet<S extends string> = 
  S extends 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' 
          | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' 
          | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' 
          | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'a' | 'b'
          | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i'
          | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p'
          | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w'
          | 'x' | 'y' | 'z'
    ? true
    : false
 
/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<IsAlphabet<'A'>, true>>,
  Expect<Equal<IsAlphabet<'z'>, true>>,
  Expect<Equal<IsAlphabet<'9'>, false>>,
  Expect<Equal<IsAlphabet<'!'>, false>>,
  Expect<Equal<IsAlphabet<'😂'>, false>>,
  Expect<Equal<IsAlphabet<''>, false>>,
]

/* _____________ 다음 단계 _____________ */
/*
  > 정답 공유하기: https://tsch.js.org/35252/answer/ko
  > 정답 보기: https://tsch.js.org/35252/solutions
  > 다른 문제들: https://tsch.js.org/ko
*/
