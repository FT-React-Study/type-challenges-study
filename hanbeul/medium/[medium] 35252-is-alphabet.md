## [medium] 35252. IsAlphabet

> View on GitHub: https://tsch.js.org/35252

#### 문제

Determine if the given letter is an alphabet.

#### 문제 설명

- 주어진 문자가 알파벳인지 확인하는 타입을 구현

#### 시도 1

> 접근 방식

- 알파벳 직접 비교

> 코드

```ts
type Alphabet =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z"
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z";

type IsAlphabet<S extends string> = S extends Alphabet ? true : false;
```

> 코드 설명

- 알파벳 문자열을 유니온 타입으로 정의
- 주어진 문자가 알파벳 문자열 유니온 타입에 속하는지 확인
