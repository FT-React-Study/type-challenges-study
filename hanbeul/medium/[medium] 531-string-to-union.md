# 531 - String to Union

> View on GitHub: https://tsch.js.org/531

## 문제

문자열 인수를 입력받는 String to Union 유형을 구현하세요.
출력은 입력 문자열의 Union type이어야 합니다.

## 문제 설명

- 문자열 인수를 입력 받을 경우, 각 문자를 유니온 타입으로 반환하는 문제
- 문자열이 비어있는 경우 never를 반환

## 정답

```ts
type StringToTuple<S extends String> = S extends `${infer First}${infer Last}`
  ? [First, ...StringToTuple<Last>]
  : [];

type StringToUnion<T extends string> = StringToTuple<T>[number];
```

## 설명

- `StringToTuple<S extends String>`은 문자열을 튜플로 변환하는 타입(298-length-of-string 참고)
- 튜플로 변환된 타입은 `[number]`를 통해 유니온 타입으로 변환(10-tuple-to-union 참고)
