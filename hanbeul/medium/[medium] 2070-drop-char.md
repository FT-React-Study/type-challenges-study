# 2070 - Drop Char

## 문제

지정된 문자를 문자열에서 제거하는 `DropChar<T, C>`를 구현하세요.

> 예시

```ts
type Butterfly = DropChar<" b u t t e r f l y ! ", " ">; // 'butterfly!'
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 119-ReplaceAll 참고해서 풀어보자

> 코드

```ts
type DropChar<
  S extends string,
  C extends string,
> = S extends `${infer Head}${C}${infer Tail}`
  ? DropChar<`${Head}${Tail}`, C>
  : S;
```

> 코드 설명

- `${infer Head}${C}${infer Tail}`를 활용해 S 안에 C가 있는지 확인
- 있을 경우, Head와 Tail을 재귀적으로 호출하여 C를 제거
- 없을 경우, S를 그대로 반환
