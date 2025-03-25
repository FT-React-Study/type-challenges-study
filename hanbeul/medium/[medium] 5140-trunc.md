## [medium] 5140. Trunc

#### 문제

문자열이나 숫자를 받아서 소수점 이하 자릿수를 제거하여 정수 부분만 반환하는 `Math.trunc`의 타입 버전을 구현하세요.

예시:

```typescript
type A = Trunc<12.34>; // 12
```

#### 시도 1

> 접근 방법

- `number`일 경우 `string`으로 변환
- 변환된 문자열에서 소수점 이하 자릿수를 제거하여 정수 부분만 반환

> 코드

```typescript
type Trunc<
  T extends number | string,
  S = `${T}`
> = S extends `${infer First}.${infer _}` ? `${First}` : S;
```

> 실패 원인

- `.3`, `-.3` 등의 예외 케이스 처리 실패

#### 시도 2 (정답)

> 접근 방법

- 만약 `infer`로 추론한 `First`가 빈 문자열이거나 `-`일 경우 0으로 처리
- 그 외에는 그대로 반환

> 코드

```typescript
type Trunc<
  T extends number | string,
  S = `${T}`
> = S extends `${infer First}.${infer _}`
  ? First extends "" | "-"
    ? `${First}0`
    : First
  : S;
```

> 코드 설명

- `S`는 `T`를 문자열로 변환한 결과
- `S`가 `.`를 포함할 경우, `First`가 빈 문자열이거나 `-`일 경우 `First`+`0`으로 처리
- 아닐 경우 `First`를 그대로 반환
- `S`가 `.`를 포함하지 않을 경우, `S`를 그대로 반환
