## [medium] 27133. Square

> View on GitHub: https://tsch.js.org/27133

#### 문제

Implement the generic type Square<T> which will return the square of the given number.

#### 문제 설명

- 주어진 숫자의 제곱을 반환하는 문제

#### 시도 1

> 접근 방식

- `0`이 있을 경우 제외하고 계산(나중에 `00`으로 계산)
- 절대값 처리
- 제곱 길이만큼의 배열 활용

> 코드

```ts
type Abs<N extends number> = `${N}` extends `-${infer R extends number}`
  ? R
  : N;

type SplitZeroes<
  N extends number,
  Z extends string = ""
> = `${N}` extends `${infer N extends number}0`
  ? SplitZeroes<N, `${Z}00`>
  : [N, Z];

type SquareTuple<
  N extends number,
  A extends any[] = [],
  Acc extends any[] = []
> = A["length"] extends N
  ? [...A, ...Acc]
  : SquareTuple<N, [1, ...A], [...A, ...A, ...Acc]>;

type Square<
  _N extends number,
  N extends [number, string] = SplitZeroes<_N>,
  U extends any[] = SquareTuple<Abs<N[0]>>
> = `${U["length"]}${N[1]}` extends `${infer N extends number}` ? N : never;
```

> 코드 설명

- `Abs<N[0]>` : 절대값 처리
- `SplitZeroes<_N>` : `0` 제외 처리 (나중에 `00` 형태로 추가 것임)
- `SquareTuple<Abs<N[0]>>` : 제곱 길이만큼의 배열 생성
- 해당 결과를 바탕으로 조합하여 제곱 결과 반환
