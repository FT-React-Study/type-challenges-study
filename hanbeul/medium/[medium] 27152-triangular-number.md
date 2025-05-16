## [medium] 27152. Triangular Number

> View on GitHub: https://tsch.js.org/27152

#### 문제

Implement the generic type Square<T> which will return the square of the given number.

#### 문제 설명

- 1부터 N까지의 합을 반환하는 문제

#### 시도 1

> 접근 방식

- Array를 활용하여 1부터 N까지 증가하는 배열 생성
- 해당 배열의 길이의 합을 반환하는 로직 생성

> 코드

```ts
type NArr<
  N extends number,
  Result extends unknown[] = []
> = Result["length"] extends N ? Result : NArr<N, [...Result, unknown]>;

type Triangular<
  N extends number,
  FirstArr extends unknown[] = NArr<N>,
  Result extends unknown[] = []
> = FirstArr["length"] extends 0
  ? Result["length"]
  : FirstArr extends [infer _, ...infer Rest]
  ? Triangular<N, Rest, [...Result, ...FirstArr]>
  : never;
```

> 코드 설명

- `NArr<N>` : 1부터 `N`까지 증가하는 배열 생성
- `FirstArr` : 최초 `N`의 크기의 배열 생성, 이후 1개씩 요소 삭제
- `Result` : `FirstArr`의 요소의 누적 합 배열
