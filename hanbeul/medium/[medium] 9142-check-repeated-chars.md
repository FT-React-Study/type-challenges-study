## [medium] 9142. Check Repeated Chars

#### 문제

> View on GitHub: https://tsch.js.org/9142

Implement type `CheckRepeatedChars<S>` which will return whether type `S` contains duplicated chars?

> 예시

```ts
type CheckRepeatedChars<'abc'>   // false
type CheckRepeatedChars<'aba'>   // true
```

#### 문제 설명

- 문자열을 받아, 중복된 문자가 있는지 확인

#### 시도 1 (정답)

> 접근 방식

- 중복 관리하는 유니온을 하나 만들고, 문자열을 순회하며 중복된 문자가 있는지 확인

> 코드

```ts
type CheckRepeatedChars<
  T extends string,
  Dup = ""
> = T extends `${infer First}${infer Rest}`
  ? First extends Dup
    ? true
    : CheckRepeatedChars<Rest, Dup | First>
  : false;
```

> 코드 설명

- `Dup`은 중복 관리하는 유니온
- 문자열을 순회하며, `Dup`에 해당 문자가 있는지 확인(`extends`)
- 중복된 문자가 있으면 true, 없으면 `Dup`에 해당 문자 추가해 재귀
