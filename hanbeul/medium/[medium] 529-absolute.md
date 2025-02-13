# 529 - Absolute

> View on GitHub: https://tsch.js.org/529

## 문제

number, string, 혹은 bigint을 받는 `Absolute` 타입을 만드세요.
출력은 양수 문자열이어야 합니다.

## 문제 설명

- 절대값을 구해 string으로 반환하는 문제
- 음수인 경우 양수로 변환
- 양수인 경우 그대로 반환

## 정답

```ts
type StringFormat<T extends number | string | bigint> = `${T}`;

type Absolute<T extends number | string | bigint> =
  StringFormat<T> extends `${infer First}${infer Rest}`
    ? First extends "-"
      ? Rest
      : `${First}${Rest}`
    : never;
```

## 설명

- `StringFormat<T>`는 `T`를 문자열로 변환하는 타입
- `StringFormat<T>`으로 변환된 문자열을 파싱하여, 첫 번째 문자가 `-`인 경우 뒤에 있는 문자열을 반환
- 첫 번째 문자가 `-`가 아닌 경우, 그대로 반환

## 추가 질문

> Typescript에서 bigint는 어떻게 표현하는가?

```ts
let foo: bigint = BigInt(100); // the BigInt function
let bar: bigint = 100n; // a BigInt literal
```

- `BigInt` 함수를 통해 생성된 `bigint`는 `number`의 서브타입이 아님
- 마찬가지로 `number`는 `bigint`의 서브타입이 아님

```ts
type IsBigInt<T> = T extends bigint ? true : false;

type Test1 = IsBigInt<bigint>; // true
type Test2 = IsBigInt<number>; // false

type IsNumber<T> = T extends number ? true : false;

type Test3 = IsNumber<number>; // true
type Test4 = IsNumber<bigint>; // false
```

- 여기서 사용된 `_`는 숫자 구분자임(단순히 가독성을 높이기 위함이며, `bigint`와 상관 없음)

## Reference

- [TypeScript 공식문서 - 3.2 릴리즈 노트(BigInt)](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-2.html#bigint)
