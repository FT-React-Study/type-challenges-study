## [medium] 34857. Defined Partial Record

> View on GitHub: https://tsch.js.org/34857

#### 문제

Using a Record with union types as keys doesn't allow you to make an object with only some of them

```ts
const record: Record<"a" | "b" | "c", number> = { a: 42, b: 10 };
// error: Property 'c' is missing in type '{ a: number; b: number; }'
// but required in type 'Record<"a" | "b" | "c", number>'
```

Using a Partial Record with union types as keys allows you to make an object without all union members, but makes all keys and values optional, potentially leaving them undefined

```ts
const partial: Partial<Record<"a" | "b" | "c", number>> = { a: 42 };
const partialType = typeof partial; // { a?: number | undefined, b? : number | undefined, c? : number | undefined }
const operation = 0 + partial.a; // error: 'partial.a' is possibly 'undefined'
const access = partial.c; // possible, type doesn't know that there is no such key
```

You need to make a type that takes the best of both worlds, creates all combinations of all the types in the union, so using a key that exists in the object gives you a defined type, but using a key that exists in the union and not in the object throws an error

```ts
const best: DefinedPartial<Record<"a" | "b" | "c", number>> = { a: 42 };
const sum = 0 + best.a; // 42
const error = best.b; // error: property 'b' does not exist on type '{ a: number; }'
```

#### 문제 설명

이 문제는 TypeScript에서 객체의 타입을 더 정확하게 제어하는 방법을 구현
현재 `Record`와 `Partial`을 사용할 때 각각 다른 문제가 존재함:

1. `Record<"a" | "b" | "c", number>`를 사용하면 `a`, `b`, `c` 모두 필수로 있어야 함.
2. `Partial<Record<"a" | "b" | "c", number>>`를 사용하면 모든 키가 선택적이 되어 `undefined`가 될 수 있고, 존재하지 않는 키에 접근해도 타입 에러가 발생하지 않음.

이 문제의 목표는 `DefinedPartial` 타입을 만들어서:

- 객체에 있는 키는 정확한 타입을 가지도록 하고
- 객체에 없는 키는 타입 에러를 발생시키도록 하는 것

예를 들어 `{ a: 42 }`라는 객체가 있을 때, `a`는 `number` 타입으로 정확히 인식되고, `b`나 `c`에 접근하면 타입 에러가 발생해야 함.

#### 시도 1

> 접근 방식

- 조합 만들어주기

> 코드

```ts
type Keys<T> = keyof T & string;

type Subsets<T extends string> = T extends infer U
  ? U extends string
    ? [U] | [U, ...Subsets<Exclude<T, U>>]
    : never
  : never;

type MergeKeys<T, K extends string[]> = K extends [
  infer Head extends keyof T,
  ...infer Tail extends string[]
]
  ? { [P in Head]: T[P] } & MergeKeys<T, Tail>
  : {};

type DefinedPartial<T extends object> = Subsets<Keys<T>> extends infer K
  ? K extends string[]
    ? MergeKeys<T, K>
    : never
  : never;
```

> 실패 이유

- 조합이 아니라, 그냥 부분 집합만 만들어짐

#### 시도 2 (정답 참고)

> 접근 방식

- 유니온과 Omit 활용한 타입 조합

> 코드

```ts
type DefinedPartial<T, K extends keyof T = keyof T> = K extends any
  ? T | DefinedPartial<Omit<T, K>>
  : never;
```

> 코드 설명

- `K extends any` 타입을 활용해 `T`의 키 값 순회
- 각 키 값에 대해 `T` 타입과 `DefinedPartial<Omit<T, K>>` 타입의 유니온 타입을 만들어줌
- 이렇게 하면 객체에 있는 키는 정확한 타입을 가지고, 없는 키는 타입 에러를 발생시키는 타입을 만들 수 있음
