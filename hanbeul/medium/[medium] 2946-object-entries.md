# 2946 - Object Entries

## 문제

`Object.entries` 함수의 타입 버전을 구현하세요.

> 예시

```typescript
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model>; // ['name', string] | ['age', number] | ['locations', string[] | null];
```

## 풀이

### 시도 1

> 접근 방식

- 키를 순회하여 키-값 쌍을 tuple로 만들어 해당 tuple들의 tuple을 만들자
- 그렇게 만들어진 tuple들을 union으로 변경하여 반환

> 코드

```ts
type ObjectEntries<T> = {
  [K in keyof T]: [K, T[K] extends undefined ? undefined : T[K]];
}[keyof T];
```

> 실패 이유

- 옵셔널한 값들에 대해서 처리 불가능

### 시도 2

> 접근 방식

- 같은 방식으로, 옵셔널한 값들을 처리할 방법을 생각해보자.
- `-?` 키워드 참고

```ts
type Required<T> = {
  [K in keyof T]-?: T[K];
};
```

> 참고

- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Required Type](https://www.typescriptlang.org/docs/handbook/utility-types.html#requiredtype)

> 코드

```ts
type ObjectEntries<T> = {
  [K in keyof T]-?: [K, T[K] extends undefined ? undefined : T[K]];
}[keyof T];
```

> 실패 이유

- partial에 대해서 처리가 안됨

### 시도 3

> 접근 방식

- `any | undefined` 타입에 대해서 처리 해버리자

> 코드

```ts
type ObjectEntries<T> = {
  [K in keyof T]-?: [
    K,
    T[K] extends undefined ? undefined : Exclude<T[K], undefined>,
  ];
}[keyof T];
```

> 실패 이유

- K가 옵셔널일 때만 처리해야되는데, 마지막 예시와 같이 필수 요소의 `any | undefined`도 처리해버림
- `Equal<ObjectEntries<{ key: string | undefined }>, ["key", string | undefined]>` 이 테스트 케이스 실패

### 시도 4 (정답)

> 접근 방식

- 키 값이 옵셔널일 때 한 번 더 분기 처리 해보자.

> 코드

```ts
type IsOptional<T, K extends keyof T> = {} extends Pick<T, K> ? true : false;

type ObjectEntries<T> = {
  [K in keyof T]-?: IsOptional<T, K> extends true
    ? [K, T[K] extends undefined ? undefined : Exclude<T[K], undefined>]
    : [K, T[K] extends undefined ? undefined : T[K]];
}[keyof T];
```

> 코드 설명

- `{} extends Pick<T, K>`의 동작 원리: `Pick<T, K>`는 T의 키 중 K를 선택하여 반환하는 타입이다.

```ts
type Example = {
  required: number;
  optional?: string;
};

type PickRequired = Pick<Example, "required">;
// 결과: { required: number }

type IsOptional1 = {} extends PickRequired ? true : false;
// 결과: false

type PickedOptional = Pick<Example, "optional">;
// 결과: { optional?: string }

type IsOptional2 = {} extends PickedOptional ? true : false;
// 결과: true
```

- `{} extends PickedOptional` 조건은 빈 객체가 `PickedOptional`의 서브타입인지 확인한다.
- 만약 required 키가 있는 경우, `{}`는 `PickedOptional`의 서브타입이 아니므로 조건이 거짓이 된다.
- 따라서, `{} extends Pick<T, K>`는 `K`가 옵셔널한 키인 경우에만 참이 된다.

- `T[K] extends undefined ? undefined : ...` 이 부분은 값이 undefined인 경우에는 undefined를 반환하고, 그렇지 않은 경우에는 처리된 값을 반환한다.
