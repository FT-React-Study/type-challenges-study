# Week 17

## [Medium-26401-JSON-schema-to-TypeScript](./medium/26401-JSON-schema-to-TypeScript.ts)

```ts
type IntersectionAsOne<T> = T extends infer R
  ? { [K in keyof R]: R[K] }
  : never;

type JSONObject = {
  type: "string" | "number" | "boolean" | "object" | "array";
  enum?: unknown[];
  properties?: { [key: string]: JSONObject };
  items?: JSONObject;
  required?: readonly string[];
};

type JSONSchema2TS<T extends JSONObject> = T["type"] extends "string"
  ? T["enum"] extends readonly string[]
    ? T["enum"][number]
    : string
  : T["type"] extends "number"
  ? T["enum"] extends readonly number[]
    ? T["enum"][number]
    : number
  : T["type"] extends "boolean"
  ? T["enum"] extends readonly boolean[]
    ? T["enum"][number]
    : boolean
  : T["type"] extends "object"
  ? "properties" extends keyof T
    ? T["properties"] extends { [key: string]: never }
      ? {}
      : "required" extends keyof T
      ? T["required"] extends readonly string[]
        ? IntersectionAsOne<
            {
              [K in keyof T["properties"] as K extends
                | T["required"][number]
                | `req${string}`
                ? K
                : never]: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            } & {
              [K in keyof T["properties"] as K extends
                | T["required"][number]
                | `req${string}`
                ? never
                : K]?: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            }
          >
        : IntersectionAsOne<
            {
              [K in keyof T["properties"] as K extends `req${string}`
                ? K
                : never]: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            } & {
              [K in keyof T["properties"] as K extends `req${string}`
                ? never
                : K]?: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            }
          >
      : IntersectionAsOne<{
          [K in keyof T["properties"]]?: T["properties"][K] extends JSONObject
            ? JSONSchema2TS<T["properties"][K]>
            : unknown;
        }>
    : Record<string, unknown>
  : T["type"] extends "array"
  ? "items" extends keyof T
    ? T["items"] extends JSONObject
      ? JSONSchema2TS<T["items"]>[]
      : unknown[]
    : unknown[]
  : never;
```

- 예시에 담겨있는 type들인 `'string', 'number', 'boolean', 'object', 'array'`에 대해서만 진행
- `JSONObject2TS` 타입이 받아들일 수 있는 key 값들을 먼저 설정
- `type` 외에 `enum`, `properties`, `items`, `requried`를 optional로 가질수 있게 설정
- 그리고 원시 타입 세가지에 대해 먼저 처리를 진행
- 원시타입일 때 enum이 튜플로 주어진다면 유니언으로 변환하여 반환하고 아니라면 원시타입 자체를 반환하도록 함
- object라면 처리해야할 내용을 다음이라고 생각했다

  - properties가 존재하는가
  - properties가 존재한다면, JSONObject.properties는 빈 객체인가, 그렇다면 `{}`를 반환
  - 빈 객체가 아니라면 required 옵션은 있는가
  - required가 있을 때, T.required는 튜플인가
  - required가 없을 때, T.properties의 각 아이템은 다시 JSONObject인가
  - 모두 아니라면 예시대로 `Record<string, unknwon>`를 반환

- required와 properties에 대해 검증하는 과정에서 `required`, `optional` 처리가 필요했기에 객체 Intersection을 진행함
- 하지만, 예시는 합쳐진 객체 타입을 필요로 했기 때문에 다시 헬퍼 타입인 IntersectionAsOne 타입을 이용함
- 배열에 대해서는 items가 존재하고 items가 JSONObject라면 모두 처리를 끝내 그 타입이 배열이 되도록, 아니라면 unknown[]를 반환하도록 함

## [Medium-27133-Square](./medium/27133-square.ts)

```ts
type BuildTuple<N extends number, T extends unknown[] = []> = T extends {
  length: N;
}
  ? T
  : BuildTuple<N, [...T, unknown]>;

type Flatten<T extends unknown[]> = T extends [infer F, ...infer R]
  ? F extends unknown[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : [];

type Build2Matrix<
  N extends number,
  Matrix extends unknown[][] = []
> = Matrix extends { length: N }
  ? Matrix
  : Build2Matrix<N, [...Matrix, BuildTuple<N>]>;

type Square<N extends number> = `${N}` extends `-${infer M extends number}`
  ? Square<M>
  : Flatten<Build2Matrix<N>>["length"];
```

- 처음 생각했던 방향은 위와 같다
- 1. N의 길이를 갖는 튜플을 만든다
- 2. 그 튜플을 N개만큼 만들어 N x N 행렬을 만든다
- 3. 그 행렬을 평탄화한 튜플을 만들어 그 길이를 구하면 곧 N^2이 된다.
- 방향성을 잡았던 순간부터 이미 타입 시스템의 재귀 깊이 문제로 인해 해결 방법은 아닐 것이라 생각했고, 실제로도 2~30 정도를 지나면 한계치였다.
- 숫자 N을 `a * 10^K`로 변환하고 `a * a`를 한 후 `a^2 + 10^(2K)`를 진행하는 방식을 고려했으나,
- 예시에 있던 `31`과 `101`을 계산하려면 다른 방식의 접근이 필요할 것이라 생각했다.
- 제출된 solution의 일부는 오히려 `extreme` 난이도의 `sum`과 `multiply`를 활용하는 방식을 취하고 있어 참고로 하기엔 어려운 부분이 있었다.

```ts
type Abs<N extends number> = `${N}` extends `-${infer M extends number}`
  ? M
  : N;

type BuildTuple<N extends number, T extends unknown[] = []> = T extends {
  length: N;
}
  ? T
  : BuildTuple<N, [...T, unknown]>;

export type Flatten<T extends unknown[]> = T extends [infer F, ...infer R]
  ? F extends unknown[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : [];

type Build2Matrix<
  N extends number,
  Matrix extends unknown[][] = []
> = Matrix extends { length: N }
  ? Matrix
  : Build2Matrix<N, [...Matrix, BuildTuple<N>]>;

type NumberExceptLeadingZeros<N extends number> =
  `${N}` extends `${infer M extends number}0` ? NumberExceptLeadingZeros<M> : N;

type CountEndZero<
  N extends string | number | bigint,
  Zeros extends unknown[] = []
> = N extends 0
  ? 0
  : `${N}` extends `${infer M}0`
  ? CountEndZero<M, [...Zeros, unknown]>
  : Zeros["length"];

type AddZeros<
  ToAdd extends number,
  ZeroCount extends number,
  Added extends string = `${ToAdd}`,
  AddCount extends unknown[] = []
> = AddCount["length"] extends ZeroCount
  ? Added extends `${infer M extends number}`
    ? M
    : never
  : AddZeros<0, ZeroCount, `${Added}00`, [...AddCount, unknown]>;

type Square<
  N extends number,
  ZeroCount = CountEndZero<Abs<N>>,
  Absed = Abs<N>
> = N extends 0
  ? 0
  : ZeroCount extends 0
  ? Flatten<Build2Matrix<Absed>>["length"]
  : AddZeros<
      Flatten<Build2Matrix<NumberExceptLeadingZeros<Absed>>>["length"],
      ZeroCount
    >;
```

- 이 방식은 끝에 있는 0을 제거하여 앞부분의 숫자를 계산 후 0의 수의 두배만큼 0을 늘려 답을 구하는 방식이다.
- 절댓값을 취하고 0의 갯수를 세고, 0을 제외한 나머지 수에 대해 N x N 행렬을 만들어 Flatten한 길이를 구한다.
- 그리고 그 숫자에 0의 갯수의 두배만큼 0을 늘려 최종 답을 얻는 방식이다.
- 타입 자체는 excessive stack 오류가 발생하지만, 101을 제외한 케이스는 해결이 가능하다.

## [Medium-27152-Triangular-number](./medium/27152-triangular-number.ts)

```ts
type Triangular<
  N extends number,
  C extends unknown[] = [],
  R extends unknown[] = []
> = C["length"] extends N
  ? R["length"]
  : Triangular<N, [...C, unknown], [...R, ...C, unknown]>;
```

- C를 이용하여 카운트를, R을 이용하여 누적된 합을 구한다.
- N번째에 해당하는 삼각수는 C의 길이가 N이 될때 R의 길이가 된다.
- N이 2인 경우 다음의 순서가 된다.

- C.length = 0, R.length = 0
- C.length = 1 [unknown], R.length = 1 [unknown]
- C.length = 2 [unknwon, unknown], R.length = 3 [이전의 R + 이전의 C + unknown (혹은 현재의 C라고도 할 수 있다)] (즉 1 + 2)

- 이처럼, 각 차례에서 C의 길이인 삼각수를 구하기 위한 다음 수를 더하는 방식으로 재귀를 진행한다.

## [Medium-27862-CartesianProduct](./medium/27862-cartesian-product.ts)

```ts
type CartesianProduct<T, U> = T extends infer TItem
  ? U extends infer UItem
    ? [TItem, UItem]
    : never
  : never;
```

- 두 유니언을 순회하면서 각 유니언의 원소 하나씩을 취해 튜플로 만들면 분배되어 튜플의 유니언이 된다.

## [Medium-27932-MergeAll](./medium/27932-merge-all.ts)

## [Medium-27958-CheckRepeatedTuple](./medium/27958-check-repeated-tuple.ts)
