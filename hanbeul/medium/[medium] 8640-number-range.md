## [medium] 8640. Number Range

> View on GitHub: https://tsch.js.org/8640

#### 문제

Sometimes we want to limit the range of numbers...

```ts
type result = NumberRange<2, 9>; //  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

#### 문제 설명

- 주어진 범위의 숫자를 반환

#### 시도 1

> 접근 방식

- L만큼의 길이를 가진 arr를 만들고, 그 길이를 계속 늘려가며 그 길이를 배열로 모아주자.

> 코드

```ts
type ConstructTuple<
  L extends number,
  Result extends unknown[] = []
> = Result["length"] extends L
  ? Result
  : ConstructTuple<L, [...Result, unknown]>;

type NumberRange<
  L extends number,
  H extends number,
  Arr extends unknown[] = ConstructTuple<L>
> = Arr["length"] extends H
  ? Arr["length"]
  : Arr["length"] | NumberRange<L, H, [...Arr, unknown]>;
```

> 실패 이유

- 140 이상의 숫자를 넣으면 터짐
- 재귀 깊이 확인 필요

#### 시도 2

> 접근 방식

- `ConstructTuple`을 사용하지 않고, 재귀를 통해 범위의 숫자를 반환

> 코드

```ts
type NumberRange<
  L extends number,
  H extends number,
  Arr extends unknown[] = [],
  IsCount = false
> = Arr["length"] extends H
  ? H
  : IsCount extends true
  ? Arr["length"] | NumberRange<L, H, [...Arr, unknown], IsCount>
  : Arr["length"] extends L
  ? L | NumberRange<L, H, [...Arr, unknown], true>
  : NumberRange<L, H, [...Arr, unknown], false>;
```

> 실패 이유

- 얘도 140 이상의 숫자를 넣으면 터짐

#### 시도 3 (답지 확인)

> 접근 방식

- Utils로 L 길이 만큼의 배열을 만듦(0, 1, 2, ...)
- L 길이와 H 길이의 배열에서 Exclude를 통해 L 이상 H 미만의 값만 남김
- 이후 유니온으로 묶어서 반환

> 코드

```ts
type Utils<L, C extends any[] = [], R = L> = C["length"] extends L
  ? R
  : Utils<L, [...C, 0], C["length"] | R>;

type NumberRange<L, H> = L | Exclude<Utils<H>, Utils<L>>;

type example = NumberRange<2, 9>;
```

> 코드 설명

- `Utils`는 재귀를 통해 L 길이 만큼의 배열을 만듦
- `C["length"] extends L` 이라면, `C`의 길이가 `L`에 도달
- 그 때까지 `R`에는 `0`부터 `L`까지의 값이 유니온으로 관리되고 있음
- 이후 `Exclude`를 통해 `L` 이상 `H` 미만의 값만 남김
- 이후 유니온으로 묶어서 반환
