# week17

## JSON Schema to TypeScript

Implement the generic type JSONSchema2TS which will return the TypeScript type corresponding to the given JSON schema.

Additional challenges to handle:

- additionalProperties
- oneOf, anyOf, allOf
- minLength and maxLength

```ts
// + Primitive types
type Type1 = JSONSchema2TS<{
  type: 'string'
}>
type Expected1 = string
type Result1 = Expect<Equal<Type1, Expected1>>

type Type2 = JSONSchema2TS<{
  type: 'number'
}>
type Expected2 = number
type Result2 = Expect<Equal<Type2, Expected2>>

type Type3 = JSONSchema2TS<{
  type: 'boolean'
}>
type Expected3 = boolean
type Result3 = Expect<Equal<Type3, Expected3>>
// - Primitive types

// + Enums
type Type4 = JSONSchema2TS<{
  type: 'string'
  enum: ['a', 'b', 'c']
}>
type Expected4 = 'a' | 'b' | 'c'
type Result4 = Expect<Equal<Type4, Expected4>>

type Type5 = JSONSchema2TS<{
  type: 'number'
  enum: [1, 2, 3]
}>
type Expected5 = 1 | 2 | 3
type Result5 = Expect<Equal<Type5, Expected5>>
// - Enums

// + Object types
type Type6 = JSONSchema2TS<{
  type: 'object'
}>
type Expected6 = Record<string, unknown>
type Result6 = Expect<Equal<Type6, Expected6>>

type Type7 = JSONSchema2TS<{
  type: 'object'
  properties: {}
}>
type Expected7 = {}
type Result7 = Expect<Equal<Type7, Expected7>>

type Type8 = JSONSchema2TS<{
  type: 'object'
  properties: {
    a: {
      type: 'string'
    }
  }
}>
type Expected8 = {
  a?: string
}
type Result8 = Expect<Equal<Type8, Expected8>>
// - Object types

// + Arrays
type Type9 = JSONSchema2TS<{
  type: 'array'
}>
type Expected9 = unknown[]
type Result9 = Expect<Equal<Type9, Expected9>>

type Type10 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'string'
  }
}>
type Expected10 = string[]
type Result10 = Expect<Equal<Type10, Expected10>>

type Type11 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'object'
  }
}>
type Expected11 = Record<string, unknown>[]
type Result11 = Expect<Equal<Type11, Expected11>>
// - Arrays

// + Mixed types
type Type12 = JSONSchema2TS<{
  type: 'object'
  properties: {
    a: {
      type: 'string'
      enum: ['a', 'b', 'c']
    }
    b: {
      type: 'number'
    }
  }
}>
type Expected12 = {
  a?: 'a' | 'b' | 'c'
  b?: number
}
type Result12 = Expect<Equal<Type12, Expected12>>

type Type13 = JSONSchema2TS<{
  type: 'array'
  items: {
    type: 'object'
    properties: {
      a: {
        type: 'string'
      }
    }
  }
}>
type Expected13 = {
  a?: string
}[]
type Result13 = Expect<Equal<Type13, Expected13>>
// - Mixed types

// + Required fields
type Type14 = JSONSchema2TS<{
  type: 'object'
  properties: {
    req1: { type: 'string' }
    req2: {
      type: 'object'
      properties: {
        a: {
          type: 'number'
        }
      }
      required: ['a']
    }
    add1: { type: 'string' }
    add2: {
      type: 'array'
      items: {
        type: 'number'
      }
    }
  }
  required: ['req1', 'req2']
}>
type Expected14 = {
  req1: string
  req2: { a: number }
  add1?: string
  add2?: number[]
}
type Result14 = Expect<Equal<Type14, Expected14>>
// - Required fields
```

### 문제 분석

Json 스키마를 분해하는 

타입만 있으면 그 원시타입을 반환한다. 근데 타입이 array면 원시타입의 배열타입으로 반환한다,.

enum은 배열로 되어있는데, 그건 유니언 타입으로 반환한다.

properties는 그 값을 객체로 반환하고 그걸 키값 속성값에 재귀하는 느낌으로 반환한다. 근데 nullable하게 한다.



### 첫번째 접근

일단 케이스 분류 별로 하나씩 해결해나가고자 했다.



```ts
type JSONSchema2TS<T extends { type: any }> = 
  T['type'] extends "string" 
    ? string
    : T['type'] extends "number"
      ? number
      : T['type'] extends "boolean"
        ? boolean
        : never
```

원시타입은 타입의 값을 찾아서 하나씩 경우를 해줬다.



```ts
type JSONSchema2TS<T extends { type: any }> = 
  T extends { enum: any }
    ? T['enum'][number]
    : T['type'] extends "string" 
      ? string
      : T['type'] extends "number"
        ? number
        : T['type'] extends "boolean"
          ? boolean
          : never
```

enum이 있는 경우 enum속성의 값들을 [number]로 유니언 타입으로 반환해줬다.



```ts
type JSONSchema2TS<T extends { type: any }> = 
  T extends { enum: any }
    ? T['enum'][number]
    : T['type'] extends "string" 
      ? string
      : T['type'] extends "number"
        ? number
        : T['type'] extends "boolean"
          ? boolean
          : T['type'] extends "object"
            ? T extends { properties: any }
              ? { [P in keyof T['properties']]?: JSONSchema2TS<T['properties'][P]> }
              : Record<string, unknown>
            : never
```

object타입인 경우 T에 properties 속성이 있는지 없는지에 따라 나눴다

있는 경우 prooerties의 값이 객체 형태로, 그 값에 재귀를 적용했다.

없는 경우 Record<string, unknown>값으로 반환했다.



```ts
type JSONSchema2TS<T extends { type: any }> = 
  T extends { enum: any }
    ? T['enum'][number]
    : T['type'] extends "string" 
      ? string
      : T['type'] extends "number"
        ? number
        : T['type'] extends "boolean"
          ? boolean
          : T['type'] extends "object"
            ? T extends { properties: any }
              ? { [P in keyof T['properties']]?: JSONSchema2TS<T['properties'][P]> }
              : Record<string, unknown>
            : T['type'] extends "array"
              ? T extends { items: infer TOfItem extends {type: any}}
                ? JSONSchema2TS<TOfItem>[]
                : unknown[]
              : never
```

array가 있는 경우 먼저 items라는 속성이 있는지 없는지 케이스를 나눴다

있는 경우 아이템의 값을 재귀돌린후 해당 타입의 배열속성으로 반환했다.

없는 경우 unknown[]로 반환했다.



```ts
type JSONSchema2TS<T extends { type: any }, IsRequiredObject extends boolean = false> = 
  T extends { enum: any }
    ? T['enum'][number]
    : T['type'] extends "string" 
      ? string
      : T['type'] extends "number"
        ? number
        : T['type'] extends "boolean"
          ? boolean
          : T['type'] extends "object"
            ? T extends { properties: any }
              ? IsRequiredObject extends true
                ? { [P in keyof T['properties']] : JSONSchema2TS<T['properties'][P], true> }
                : ({ [P in keyof T['properties'] as P extends `req${string}` ? P : never]: JSONSchema2TS<T['properties'][P], true> }
                  & { [P in keyof T['properties'] as P extends `req${string}` ? never: P]?: JSONSchema2TS<T['properties'][P]> }) extends infer S 
                    ? {[P in keyof S]: S[P]} 
                    : never
              : Record<string, unknown>
            : T['type'] extends "array"
              ? T extends { items: infer TOfItem extends {type: any}}
                ? JSONSchema2TS<TOfItem>[]
                : unknown[]
              : never
```

properties의 속성값이 req+숫자 형태일때는 nullable하지 않게 만들어야 하는 케이스도 있었다

이 경우 as를 통해 객체를 경우 두개로 나눠서 합쳤다.



이때 단순히 최상위 단계에서만 required 속성으로 바꾸는게 아니라 그 아래 레벨에서도 바꿔야 했다.

그래서 flag제네릭 하나 추가해서 그 경우 true를 넣어서 재귀하였다.