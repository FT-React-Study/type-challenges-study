# 3196 - FlipArguments

## 문제

lodash의 `_.flip` 함수를 타입으로 구현하세요.

FlipArguments<T> 타입은 함수 타입 T를 요구하며, 동일한 반환 타입을 가지지만 매개변수가 반대로 된 새로운 함수 타입을 반환합니다.

> 예시

```typescript
type Flipped = FlipArguments<
  (arg0: string, arg1: number, arg2: boolean) => void
>;
// (arg0: boolean, arg1: number, arg2: string) => void
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- `T`의 `args`를 순회하며 각각의 arg type을 저장한 뒤, `reverse` 해서 다시 할당해보자.
- `3192-reverse` 문제를 참고

> 코드

```typescript
type Reverse<T extends any[]> = T extends [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : T;

type FlipArguments<T extends (...args: any[]) => any> = T extends (
  ...args: infer Args
) => infer ReturnType
  ? (...args: Reverse<Args>) => ReturnType
  : never;
```

> 코드 설명

- `T extends (...args: any[]) => any` 형태로 함수 타입 제어
- `...args: infer Args` 형태로 함수의 인자 타입을 추론 (인자는 튜플 타입으로 추론됨)
- `(...args: Reverse<Args>) => ReturnType` 형태로 인자를 뒤집은 뒤, 반환 타입을 그대로 반환
- 함수 타입이 아닌 경우, `never` 타입 반환
