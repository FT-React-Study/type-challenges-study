# 1130 - ReplaceKeys

## 문제

Union type의 key를 대체하는 ReplaceKeys를 구현하세요.
만약 일부 유형에 해당 key가 존재하지 않는다면 대체하지 않습니다. 타입은 세 개의 인자를 받습니다.

> 예시

```ts
type NodeA = {
  type: "A";
  name: string;
  flag: number;
};

type NodeB = {
  type: "B";
  id: number;
  flag: number;
};

type NodeC = {
  type: "C";
  name: string;
  flag: number;
};
```

## 풀이

### 시도 1

> 접근 방식

- 유니온 타입을 순회하며 각 요소에 대해 T를 순회하며 키 값이 존재하면 Y[T]를, 존재하지 않는다면 never를 넣어주는 방식

> 코드

```ts
type ReplaceKeys<U, T extends keyof any, Y> = U extends U
  ? T extends T
    ? T extends keyof U
      ? T extends keyof Y
        ? Y[T]를 추가한 U
        : never
      : Record<T, never>를 추가한 U
    : never
  : never;
```

> 실패 이유

- `Y[T]를 추가한 U`, `Record<T, never>`를 추가한 U를 구현할 방법을 못찾음

### 시도 2 (답지 확인)

> 접근 방식

> 코드

```ts
type ReplaceKeys<U, T extends keyof any, Y> = {
  [K in keyof U]: K extends T ? (K extends keyof Y ? Y[K] : never) : U[K];
};
```

> 코드 설명

- `T`는 키값이므로 `extends keyof any`로 선언
- `K in keyof U`는 유니온 타입으로 묶인 각 객체들의 키들을 모두 순회
- 각 키에 대해 `K extends T` 조건을 만족할 경우(T가 객체의 키 값일 경우), 다음 조건 확인
- `K`가 `Y`의 키 값일 경우, `Y[K]`를 반환, 아닐 경우 `never`를 반환
- `K`가 `T`의 키 값이 아닐 경우, `U[K]`를 반환
