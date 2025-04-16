## [medium] 9989. Count Element Number to Object

> View on GitHub: https://tsch.js.org/9989

#### 문제

With type `CountElementNumberToObject`, get the number of occurrences of every item from an array and return them in an object.

> 예시

```ts
type Simple1 = CountElementNumberToObject<[]>; // return {}
type Simple2 = CountElementNumberToObject<[1, 2, 3, 4, 5]>;
// return {
//   1: 1,
//   2: 1,
//   3: 1,
//   4: 1,
//   5: 1
// }

type Simple3 = CountElementNumberToObject<[1, 2, 3, 4, 5, [1, 2, 3]]>;
// return {
//   1: 2,
//   2: 2,
//   3: 2,
//   4: 1,
//   5: 1
// }
```

#### 문제 설명

- 배열을 받아, 각 요소의 개수를 객체로 반환

#### 시도 1

> 접근 방식

- 우선 배열을 `flatten` 처리
- 이후 각 요소를 돌면서 `result`에 해당 요소가 존재하는지 확인
- 있을 경우에 `value`의 카운트만 증가, 없을 경우에는 새로운 레코드 추가

> 코드

```ts
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

type GetResult<T extends Record<string, unknown[]>> = {
  [K in keyof T]: T[K]["length"];
};

type AddResult<
  T extends PropertyKey,
  Result extends Record<string, unknown[]>
> = {
  [K in keyof Result]: K extends `${T}` ? [...Result[K], unknown] : Result[K];
} & (`${T}` extends keyof Result ? {} : { [K in `${T}`]: [unknown] });

type GetCountElement<
  T extends any[],
  Result extends Record<string, unknown[]> = {}
> = T extends [infer First, ...infer Rest]
  ? [First] extends [never]
    ? GetCountElement<Rest, Result>
    : First extends PropertyKey
    ? GetCountElement<Rest, AddResult<First, Result>>
    : GetCountElement<Rest, Result>
  : GetResult<Result>;

type CountElementNumberToObject<T extends any[]> = GetCountElement<Flatten<T>>;
```

> 코드 설명

- 우선 배열을 `flatten` 처리
- `never` 처리를 위해 `[First] extends [never]` 처리
- 이후 각 요소를 돌면서 `result`에 해당 요소가 존재하는지 확인
- 있을 경우에 `value`의 카운트 추가(`unknown[]`), 없을 경우에는 새로운 레코드 추가
- 이후 `GetResult` 타입을 통해 객체로 반환

> 실패 이유

- 객체 키의 타입을 넣어주기엔 키 값으로 들어갈 수 없는 타입들이 생겨서 분기처리가 너무 복잡해짐

#### 시도 2 (답지 확인)

> 코드

```ts
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : [];

type Count<T, R extends Record<string | number, any[]> = {}> = T extends [
  infer F extends string | number,
  ...infer L
]
  ? F extends keyof R
    ? Count<L, Omit<R, F> & Record<F, [...R[F], 0]>>
    : Count<L, R & Record<F, [0]>>
  : {
      [K in keyof R]: R[K]["length"];
    };

type CountElementNumberToObject<T extends any[]> = [T] extends [[never]]
  ? {}
  : Count<Flatten<T>>;
```

> 코드 설명

- 배열 `flatten` 처리
- `infer`를 활용해 `F` 를 `string | number` 타입으로 제한
- `F` 가 `keyof R` 에 존재하는지 확인
- 존재할 경우 `Count<L, Omit<R, F> & Record<F, [...R[F], 0]>>` 처리
  - 기존 객체에서 `F` 를 제외한 객체를 만들고, `F` 를 키로 하고 값을 `[...R[F], 0]` 으로 하는 객체를 만들어 합침 (count 증가)
- 존재하지 않을 경우 `Count<L, R & Record<F, [0]>>` 처리
  - `R & Record<F, [0]>` 는 `R` 에서 `F` 를 키로 하고, 값을 `[0]` 으로 하는 객체
- `T` 순회를 마치면 `[K in keyof R]: R[K]["length"]` 타입을 통해 객체로 반환
