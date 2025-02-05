# 116-Replace

> View on GitHub: https://tsch.js.org/116

## 문제

문자열 S에서 `From`를 찾아 한 번만 `To`로 교체하는 `Replace<S, From, To>`를 구현하세요.

## 정답

```ts
type Replace<
  S extends string,
  From extends string,
  To extends string,
> = From extends ""
  ? S
  : S extends `${infer RestHead}${From}${infer RestTail}`
    ? `${RestHead}${To}${RestTail}`
    : S;
```

## 시도했던 오답

```ts
// 1차 시도
type Replace<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer RestHead}${From}${infer RestTail}`
  ? `${RestHead}${To}${RestTail}`
  : S;
```

## 설명

- `From`이 빈 문자열인 경우 원래 문자열을 반환
- `infer` 키워드를 사용하여 문자열을 `RestHead`, `From`, `RestTail`로 분리
- `S`가 `From`을 포함하는 경우(조건이 True 일 때) `From`을 `To`로 교체하고 나머지 문자열을 합쳐서 반환
- `From`이 빈 문자열이 아니고 `S`가 `From`을 포함하지 않는 경우 원래 문자열을 반환
