# 2688 - StartsWith

## 문제

문자열 `T`가 문자열 `U`로 시작하는지 확인하는 `StartsWith<T, U>`를 구현하세요.

> 예시

```ts
type a = StartsWith<"abc", "ac">; // expected to be false
type b = StartsWith<"abc", "ab">; // expected to be true
type c = StartsWith<"abc", "abcd">; // expected to be false
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- infer를 통해 맨 앞 한글자씩을 비교해보자
- 죽도록 비교해서 지는 쪽이 false가 되도록...

> 코드

```ts
type StartsWith<T extends string, U extends string> = T extends U
  ? true
  : T extends `${infer TFirst}${infer TRest}`
    ? U extends `${infer UFirst}${infer URest}`
      ? TFirst extends UFirst
        ? StartsWith<TRest, URest>
        : false
      : true
    : false;
```

> 코드 설명

- `T extends U` 조건: 문자열 T가 U와 일치하는지 확인
- 일치하지 않을 경우, 각각의 첫 글자끼리 비교
- 만약 각각의 첫 글자가 일치할 경우, 나머지 문자열끼리 비교(재귀)
- 만약 각각의 첫 글자가 일치하지 않을 경우, false 반환
- T가 남아있는데(TFirst와 TRest로 분리되는데) U가 남아있지 않을 경우 true 반환
