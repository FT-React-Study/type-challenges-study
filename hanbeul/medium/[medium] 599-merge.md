# 599 - Merge

> View on GitHub: https://tsch.js.org/599

## 문제

두 개의 객체를 병합하는 제네릭 `Merge<F, S>`를 구현하세요.

## 문제 설명

- 두 개의 객체를 병합하는 문제
- 두 번째 객체의 키가 첫 번째 객체의 키를 덮어씀
- 단순한 인터섹션 타입이 아닌, 두 객체의 키를 모두 포함하는 타입을 반환

## 정답

```ts
type Merge<F, S> = {
  [P in keyof F | keyof S]: P extends keyof S
    ? S[P]
    : P extends keyof F
      ? F[P]
      : never;
};
```

## 설명

- `[P in keyof F | keyof S]`를 활용해 두 객체의 키를 모두 순회
- 만약 `P`가 `keyof S`에 속한다면, `S[P]`를 먼저 반환(덮어쓰기)
- 만약 `P`가 `keyof S`에 속하지 않고, `keyof F`에 속한다면, `F[P]`를 반환

## 오답노트

> 1차 시도

```ts
type Merge<F, S, MergedObject = F & S> = {
  [P in keyof MergedObject]: MergedObject[P];
};
type example = Merge<Foo, Bar>;
// { a: number; b: never; c: boolean; }
```

- `MergedObject`라는 `F`와 `S`의 유니온 타입을 선언해주고, 이를 순환하는 방식
- 이 경우 중복되는 키의 경우, value가 never로 처리됨

## 추가 질문

> 왜 중복되는 키의 경우, value가 never로 처리되는지?

- 인터섹션 타입의 경우, 동일한 키가 충돌할 경우에는 별도의 규칙이 적용됨
- 예를 들어, `{ a: number } & { a: string }`의 경우, `{ a: number & string }`로 처리됨
- 이 경우, `a`의 타입은 `number & string`이 되며, 이는 유효하지 않은 타입이므로 `never`로 처리됨
