## [medium] 26401. JSON Schema to TypeScript

> View on GitHub: https://tsch.js.org/26401

#### 문제

Implement the generic type JSONSchema2TS which will return the TypeScript type corresponding to the given JSON schema.

Additional challenges to handle:

- additionalProperties
- oneOf, anyOf, allOf
- minLength and maxLength

#### 문제 설명

- 주어진 JSON Schema를 TypeScript 타입으로 변환하는 문제
- 추가 챌린지
  - additionalProperties
  - oneOf, anyOf, allOf
  - minLength and maxLength

#### 시도 1

> 접근 방식

- string, number, boolean은 그대로 반환
- enum일 경우 해체
- object일 경우 재귀
- array일 경우 재귀
- object의 경우 required, readonly 등 처리

> 코드

```ts
type JSONSchema2TS<T> = T extends { enum: infer E extends readonly any[] }
  ? E[number]
  : T extends { type: "string" }
  ? string
  : T extends { type: "number" }
  ? number
  : T extends { type: "boolean" }
  ? boolean
  : T extends { type: "object" }
  ? T extends { properties: infer P }
    ? T extends { required: readonly (infer R extends string)[] }
      ? {
          [K in Extract<keyof P, R[number]>]: JSONSchema2TS<P[K]>;
        } & {
          [K in Exclude<keyof P, R[number]>]?: JSONSchema2TS<P[K]>;
        }
      : {
          [K in keyof P]?: JSONSchema2TS<P[K]>;
        }
    : Record<string, unknown>
  : T extends { type: "array" }
  ? T extends { items: infer I }
    ? JSONSchema2TS<I>[]
    : unknown[]
  : never;
```

> 코드 설명

- `enum` 타입일 경우, `E[number]` 형태로 반환
- `string`, `number`, `boolean` 타입일 경우 그대로 반환
- `object` 타입일 경우, `properties`와 `required`를 처리, 이후 재귀
- `array` 타입일 경우, 재귀로 처리
