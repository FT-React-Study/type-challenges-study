# 119-ReplaceAll

> View on GitHub: https://tsch.js.org/119

## 문제

문자열 S에서 `From`를 찾아 모두 `To`로 교체하는 `ReplaceAll<S, From, To>`를 구현하세요.

## 정답

```ts
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = From extends ""
  ? S
  : S extends `${infer RestHead}${From}${infer RestTail}`
    ? `${RestHead}${To}${ReplaceAll<RestTail, From, To>}`
    : S;
```

## 시도했던 오답

```ts
// 1차 시도
type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = S extends `${infer RestHead}${From}${infer RestTail}`
  ? ReplaceAll<`${RestHead}${To}${RestTail}`, From, To>
  : S;
```

## 설명

- `From`이 빈 문자열인 경우 원래 문자열을 반환
- `infer` 키워드를 사용하여 문자열을 `RestHead`, `From`, `RestTail`로 분리
- `S`가 `From`을 포함하는 경우(조건이 True 일 때) `From`을 `To`로 교체하고 `From` 이후 문자열(`RestTail`)을 재귀적으로 처리
- `From`이 빈 문자열이 아니고 `S`가 `From`을 포함하지 않는 경우 원래 문자열을 반환
