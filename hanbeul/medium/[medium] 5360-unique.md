## [medium] 5360. Unique

#### 문제

Implement the type version of `Lodash.uniq`, `Unique<T>` takes an Array `T`, returns the Array `T` without repeated values.

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
```

#### 문제 설명

- `Lodash.uniq` 메서드를 타입 레벨에서 구현
- 배열 `T`를 받아서, 배열의 중복된 값을 제거한 배열을 반환

#### 시도 1

- 배열을 순회하면서, 요소가 중복되는지 확인
- 중복되지 않으면 중복 체크용 유니온에 해당 요소 추가

> 코드

```ts
type Unique<
  T extends any[],
  Exists = never,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? First extends Exists
    ? Unique<Rest, Exists, Result>
    : Unique<Rest, Exists | First, [...Result, First]>
  : Result;
```

> 실패 이유

- `any` 등의 타입은 `extends`로 비교할 수 없음.
- 따라서 `MyEqual` 타입을 만들어서 비교해야 함.

#### 시도 2

> 접근 방식

- `MyEqual` 타입을 만들고, 유니온 각 요소를 확인하면서 `MyEqual`이 단 하나라도 `true`인지 확인

> 코드

```ts
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type MyExtends<T, Exists extends any[]> = Exists extends [
  infer First,
  ...infer Rest
]
  ? MyEqual<T, First> extends true
    ? true
    : MyExtends<T, Rest>
  : false;

type Unique<
  T extends any[],
  Exists extends any[] = [],
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? MyExtends<First, Exists> extends true
    ? Unique<Rest, Exists, Result>
    : Unique<Rest, [...Exists, First], [...Result, First]>
  : Result;
```

> 코드 설명

- `MyEqual` 타입을 만들고, 유니온 각 요소를 확인하면서 `MyEqual`이 단 하나라도 `true`인지 확인
- 만약 `true`라면 무시하고 나머지 재귀호출
- 만약 `false`라면 해당 요소를 유니온에 추가하고 나머지 재귀호출
- 마지막에 `Result` 반환
