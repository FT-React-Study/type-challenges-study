## [medium] 7544. Construct Tuple

> View on GitHub: https://tsch.js.org/7544

#### 문제

Construct a tuple with a given length.

```ts
type result = ConstructTuple<2>; // expect to be [unknown, unkonwn]
```

#### 문제 설명

- 주어진 길이의 튜플을 생성
- 주어진 길이만큼 `unknown` 타입의 요소를 가진 튜플을 반환

#### 시도 1 (정답)

> 접근 방식

- 재귀를 통해 튜플을 생성
- `Result`의 `length`가 `L`이 될 때까지 재귀 호출

> 코드

```ts
type ConstructTuple<
  L extends number,
  Result extends unknown[] = []
> = Result["length"] extends L
  ? Result
  : ConstructTuple<L, [...Result, unknown]>;
```

> 코드 설명

- `Result`의 `length`가 `L`이 될 때까지 재귀 호출
- `Result`의 `length`가 `L`이 되면 튜플을 반환

> 의문점

- ts의 재귀 깊이는 1000인가? 다른 문제에서는 100정도만으로도 터지던데... 정확한 매커니즘을 알고 싶다.
