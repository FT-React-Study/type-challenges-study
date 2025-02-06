# 191-AppendArgument

> View on GitHub: https://tsch.js.org/191

## 문제

함수 타입 `Fn`과 어떤 타입 `A`가 주어질 때 `Fn`의 인수와 `A`를 마지막 인수로 받는 `Fn`과 동일한 함수 유형인 `G`를 생성하세요.

## 정답

```ts
type AppendArgument<Fn extends (...args: any[]) => any, A> = Fn extends (
  ...args: infer Args
) => infer Return
  ? (...args: [...Args, A]) => Return
  : never;
```

## 시도했던 오답

```ts
// 1차 시도
type AppendArgument<Fn extends (...args: any[]) => any, A> = Fn extends (
  ...args: infer Args
) => infer Return
  ? ([Args, A]) => Return
  : never;
```

## 설명

- 우선 `Fn`에서 인수와 반환 타입을 추출해야 됨
- `[easy] 3312-parameters` 문제를 참고하여 인수를 추출
- `[medium] 2-return-type` 문제를 참고하여 반환 타입을 추출
- 추출된 인수에 A를 추가하여 반환 타입을 반환하는 함수 타입을 생성
- 이 때 추출된 인수는 배열로 추출되므로 스프레드 배열에 A를 추가

## 참고

- [easy] 3312-parameters
- [medium] 2-return-type
