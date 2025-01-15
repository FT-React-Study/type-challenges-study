## 268-If

> View on GitHub: https://tsch.js.org/268

### 문제

조건 `C`, 참일 때 반환하는 타입 `T`, 거짓일 때 반환하는 타입 `F`를 받는 타입 `If`를 구현하세요. `C`는 `true` 또는 `false`이고, `T`와 `F`는 아무 타입입니다.

### 정답

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
```

### 설명

- `C extends true ? T : F`는 `C`가 `true`일 때 `T`를 반환하고, `false`일 때 `F`를 반환
- `C extends true`에서 `extends`는 조건부 타입 정의에 사용됨. 삼항 연산자와 비슷한 역할.

### 추가 질문

> 조건부 타입에서 extends는 모든 타입을 받을 수 있을까?

- 조건부 타입에서 `extends`는 모든 타입을 받을 수 있음
- 유니온 타입일 경우 분배 법칙이 적용되어 각 요소에 대해 개별적으로 판단

```ts
type Example<T> = T extends string ? true : false;
type Result = Example<"a" | 1>; // true | false
```

- 서브타입 관계가 성립하는 타입은 `true`를 반환 (Intersection Type 포함)

```ts
// Subtype Relation
type IsSubType = { a: string } extends { a: string; b?: number } ? true : false; // true

// Intersection Type
type Intersection<T> = T extends { a: string } & { b: number } ? true : false;
type Result = Intersection<{ a: string; b: number }>; // true
```

- `any` 타입은 모든 타입의 서브타입이므로 `true`를 반환

```ts
type IsAny<T> = T extends any ? true : false;
type Result = IsAny<any>; // true
```

- `never` 타입은 평가되지 않음(`never`를 반환)

```ts
type IsNever<T> = T extends never ? true : false;
type Result = IsNever<never>; // never
```

- 튜플과 배열도 평가 가능

```ts
type IsArray<T> = T extends any[] ? true : false;
type Result1 = IsArray<number[]>; // true
type Result2 = IsArray<number>; // false
```

### Reference

- [TypeScript 공식문서 - 조건부 타입](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
