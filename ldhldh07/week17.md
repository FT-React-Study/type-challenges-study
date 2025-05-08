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



## Square

```ts
type cases = [
  Expect<Equal<Square<0>, 0>>,
  Expect<Equal<Square<1>, 1>>,
  Expect<Equal<Square<3>, 9>>,
  Expect<Equal<Square<20>, 400>>,
  Expect<Equal<Square<100>, 10000>>,
  Expect<Equal<Square<101>, 10201>>,

  // Negative numbers
  Expect<Equal<Square<-2>, 4>>,
  Expect<Equal<Square<-5>, 25>>,
  Expect<Equal<Square<-31>, 961>>,
  Expect<Equal<Square<-50>, 2500>>,
]
```



### 첫번째 접근

```ts
type Flatten<T extends any[][]> = 
  T extends  [infer First extends any[], ...infer Rest extends any[][]]
    ? [...First, ...Flatten<Rest>]
    : []

type Square<
  N extends number, 
  Abs extends number = `${N}` extends `-${infer A extends number}` ? A : N,
  Temp extends any[] = []
> =
  Temp['length'] extends Abs
    ? { [P in keyof Temp]: Temp }
    : Square<N, Abs, [...Temp, any]> extends infer S extends any[][]
      ? Flatten<S>['length']
      : never
```

2차 배열을 만든 다음에 평탄화 시켜서 length를 구하고자 했다.

뭔가 재귀 너무 깊게 해서 안되는것 같았다.



## 두번째 접근

```ts
type Square<
  N extends number, 
  FirstArray extends any[] = [],
  SecondArray extends any[] = [],
  FinalArray extends any[] = [],
  Abs extends number = `${N}` extends `-${infer A extends number}` ? A : N,
> =
  SecondArray['length'] extends Abs
    ? FinalArray['length']
    : FirstArray['length'] extends Abs
      ? Square<N, FirstArray, [...SecondArray, any], [...FinalArray, ...FirstArray]>
      : Square<N, [...FirstArray, any], SecondArray, FinalArray>
```

그래서 그냥 배열 두개 만들어서 N개의 any를 가진 배열을 만들고 그걸 스프레드로 계속 더해서 length를 구했다.

근데 이 경우 마지막 두개의 케이스가 너무 큰 수를 가진 튜플이라고 해당이 안됐다.



100이상일때부터의 답까지는 복잡도가 너무 높아서 

https://github.com/type-challenges/type-challenges/issues?q=label%3A27133+label%3Aanswer+sort%3Areactions-%2B1-desc

해당 답들을 읽어보고 넘겼다.



##  Triangular Number

Given a number N, find the Nth triangular number, i.e. `1 + 2 + 3 + ... + N`

```ts
type cases = [
  Expect<Equal<Triangular<0>, 0>>,
  Expect<Equal<Triangular<1>, 1>>,
  Expect<Equal<Triangular<3>, 6>>,
  Expect<Equal<Triangular<10>, 55>>,
  Expect<Equal<Triangular<20>, 210>>,
  Expect<Equal<Triangular<55>, 1540>>,
  Expect<Equal<Triangular<100>, 5050>>,
]
```



### 문제 분석

숫자를 제네릭으로 받아 1부터 그 숫자까지 누적하여 더한 값을 반환한다.



### 첫번째 접근 - 정답

```ts
type Triangular<N extends number, CountArray extends any[] = [], TriangularArray extends any[] = []> =
  CountArray['length'] extends N
    ? TriangularArray['length']
    : Triangular<N, [...CountArray, any], [...TriangularArray, ...CountArray, any]>
```

count를 저장하는 array를 만들고 count는 원소 하나씩 더하고, 전체 array에는 그 count에 원소 더한 배열을 더하는 식으로 구했다.



### 통과하지 못하는 답

```ts
type TriangularArray<N extends number, CountArray extends any[] = []> =
  CountArray['length'] extends N
    ? []
    : [...CountArray, any, ...TriangularArray<N, [...CountArray, any]>]

type Triangular<N extends number> = TriangularArray<N>['length']
```

배열 내에서 재귀하는 방식이 더 깔끔하지 않을까 해서 해봤는데 이건 재귀 제한에 걸려서 마지막 2개 케이스가 안됐다.



## Cartesian Product

Given 2 sets (unions), return its Cartesian product in a set of tuples, e.g.

```ts
CartesianProduct<1 | 2, 'a' | 'b'> 
// [1, 'a'] | [2, 'a'] | [1, 'b'] | [2, 'b']
```

```ts
type cases = [
  Expect<Equal<CartesianProduct<1 | 2, 'a' | 'b'>, [2, 'a'] | [1, 'a'] | [2, 'b'] | [1, 'b']>>,
  Expect<Equal<CartesianProduct<1 | 2 | 3, 'a' | 'b' | 'c' >, [2, 'a'] | [1, 'a'] | [3, 'a'] | [2, 'b'] | [1, 'b'] | [3, 'b'] | [2, 'c'] | [1, 'c'] | [3, 'c']>>,
  Expect<Equal<CartesianProduct<1 | 2, 'a' | never>, [2, 'a'] | [1, 'a'] >>,
  Expect<Equal<CartesianProduct<'a', Function | string>, ['a', Function] | ['a', string]>>,
]
```

### 문제 분석

유니언 타입으로 두개를 받는다. 그리고 두개 타입의 모든 짝을 배열로 묶고 그 배열들의 유니언 타입으로 반환한다.



### 첫번째 접근 - 정답

```ts
type CartesianProduct<T, U> = 
  T extends unknown
    ? U extends unknown
      ? [T, U]
      : never
    : never
```

T, U를 extends로 분배법칙 돌려놓고 배열을 반환힌다. 분배법칙은 반환값들의 유니언 값으로 반환하기 때문에 정답과 같은 형식으로 타입을 반환한다.



## Merge All

Merge variadic number of types into a new type. If the keys overlap, its values should be merged into an union.

For example:

```ts
type Foo = { a: 1; b: 2 }
type Bar = { a: 2 }
type Baz = { c: 3 }

type Result = MergeAll<[Foo, Bar, Baz]> // expected to be { a: 1 | 2; b: 2; c: 3 }
```

```ts
type cases = [
  Expect<Equal<MergeAll<[]>, {} >>,
  Expect<Equal<MergeAll<[{ a: 1 }]>, { a: 1 }>>,
  Expect<Equal<
    MergeAll<[{ a: string }, { a: string }]>,
    { a: string }
>
  >,
  Expect<Equal<
    MergeAll<[{ }, { a: string }]>,
    { a: string }
>
  >,
  Expect<Equal<
    MergeAll<[{ a: 1 }, { c: 2 }]>,
    { a: 1, c: 2 }
>
  >,
  Expect<Equal<
    MergeAll<[{ a: 1, b: 2 }, { a: 2 }, { c: 3 }]>,
    { a: 1 | 2, b: 2, c: 3 }
>
  >,
  Expect<Equal<MergeAll<[{ a: 1 }, { a: number }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: number }, { a: 1 }]>, { a: number }>>,
  Expect<Equal<MergeAll<[{ a: 1 | 2 }, { a: 1 | 3 }]>, { a: 1 | 2 | 3 }>>,
]
```

### 문제 분석

여러개의 객체를 받아서 객체들간 키값

### 첫번째 접근

```ts
type MergeAll<XS> = 
  XS extends [...infer Rest, infer Last]
    ? MergeAll<Rest> & Last extends infer S ? {[P in keyof S]: S[P]} : never
    : {}
```

배열에 있는 객체들을 일단 하나와 나머지를 합치는 식으로 &로 묶고  객체 합치기 했다.

이런식으로 

첫번째와 두번째 merge, 

첫번째 두번째 merge한 것과 세번째 merge

...

반복해서 전체가 merge되도록 했다.



하지만 이런 경우 겹치는 키들의 값이 유니언으로 합쳐지는 것을 구현하지 못했다.



### 두번째 접근 - 정답

```ts
type MergeAll<XS> = 
    XS extends [...infer Rest, infer Last]
      ? {[P in (keyof MergeAll<Rest> | keyof Last)]: 
          (P extends keyof MergeAll<Rest> ? MergeAll<Rest>[P] : never) | (P extends keyof Last ? Last[P] : never)}
      : {}
```

하나와 나머지 형태로 합칠때 단순히 &로 한것이 아니라 두개의 키값을 유니온으로 합친 형식으로 햇다.

그리고 각 객체에 존재하는 경우에 그 값을 유니언으로 묶었다.



## CheckRepeatedTuple

Implement type `CheckRepeatedChars<T>` which will return whether type `T` contains duplicated member

For example:

```ts
type CheckRepeatedTuple<[1, 2, 3]>   // false
type CheckRepeatedTuple<[1, 2, 1]>   // true
```

```ts
type cases = [
  Expect<Equal<CheckRepeatedTuple<[number, number, string, boolean]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[number, string]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 3]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[1, 2, 1]>, true>>,
  Expect<Equal<CheckRepeatedTuple<[]>, false>>,
  Expect<Equal<CheckRepeatedTuple<string[]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[number, 1, string, '1', boolean, true, false, unknown, any]>, false>>,
  Expect<Equal<CheckRepeatedTuple<[never, any, never]>, true>>,
]
```



### 문제 분석

반복되는 타입이 있는지 확인하고 있는 경우 true를 반환한다.



### 첫번째 접근

```ts
type CheckRepeatedTuple<T extends unknown[]> = 
  T extends [infer First, ...infer Rest]
    ? First extends Rest[number]
      ? true
      : CheckRepeatedTuple<Rest>
    : false
```

배열을 첫번째와 나머지로 나눈다.

그리고 나머지를 유니온으로 바꿔서 첫번째가 포함되는지 파악한다.

이걸 마지막 원소까지 반복한다.



이 경우 마지막 2개의 케이스를 통과 못했다.



### 두번째 접근

```ts
type CheckRepeatedTuple<T extends unknown[]> = 
  T extends [infer First, ...infer Rest]
    ? Rest[number] extends infer RN  
      ? (
          (<T>() => T extends First ? 1 : 2) extends
          (<T>() => T extends RN ? 1 : 2)
            ? true
            : CheckRepeatedTuple<Rest>
        )
      : never
    : false;
```

분배법칙을 쓴 후 똑같은 타입인지 비교한다.



첫번째 네번째 경우가 통과가 안된다.



#### 분배법칙은 제네릭으로 입력될때만 작동한다.

지금까지 항상 써왔어서 몰랐는데 분배법칙은 제네릭 타입에만 적용된다

> 제네릭 타입 위에서 조건부 타입은 유니언 타입을 만나면 *분산적으로* 동작합니다. (공식문서 Conditional Types) 



### 세번째 접근

```ts
type CheckRepeatedTuple<T extends unknown[],> = 
  T extends [infer First, ...infer Rest]
    ? Rest extends [infer FirstOfRest, ...infer RestOfRest]
      ? (<T>() => T extends First ? 1 : 2) extends
        (<T>() => T extends FirstOfRest ? 1 : 2)
        ? true
        : CheckRepeatedTuple<[First, ...RestOfRest]>
      : false
    : false
```



그냥 배열로 나눠서 짝을 지어서 비교했다.

1과 나머지 하나하나 비교

2와 3부터 하나하나 비교

이를 반복해서 같은게 있으면 true를 반환하도록 했다.



이때 Rest에서 하나씩 비교할때는 재귀로 [First, ...RestOfRest]를 해서 FirstOfRest로 비교한 값이 빠진채로 재귀돌게 했다. 