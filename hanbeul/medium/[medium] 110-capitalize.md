# 110-Capitalize

> View on GitHub: https://tsch.js.org/110

## 문제

문자열의 첫 글자만 대문자로 바꾸고 나머지는 그대로 놔두는 `Capitalize<T>`를 구현하세요.

## 정답

```ts
type MyCapitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : "";
```

## 시도했던 오답

```ts
// 1차 시도
type MyCapitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${First["toUpperCase"]}${Rest}`
  : "";
```

## 설명

- `infer` 키워드를 사용하여 문자열을 첫 글자와 나머지 문자열로 분리
- 첫 글자를 `Uppercase` 타입으로 변환 (`S["toUpperCase"]`가 될 줄 알았음...)
- 나머지 문자열을 첫 글자와 합쳐서 반환

## Reference

- [TypeScript 공식 문서 - UppercaseStringType](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html#uppercasestringtype)
