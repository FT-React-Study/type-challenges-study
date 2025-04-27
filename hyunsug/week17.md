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

## [Medium-27152-Triangular-number](./medium/27152-triangular-number.ts)

## [Medium-27862-CartesianProduct](./medium/27862-cartesian-product.ts)

## [Medium-27932-MergeAll](./medium/27932-merge-all.ts)

## [Medium-27958-CheckRepeatedTuple](./medium/27958-check-repeated-tuple.ts)
