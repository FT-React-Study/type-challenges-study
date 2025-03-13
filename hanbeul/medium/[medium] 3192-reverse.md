# 3192 - Reverse

## 문제

튜플을 뒤집는 타입을 구현하세요.

> 예시

```typescript
type a = Reverse<["a", "b"]>; // ['b', 'a']
type b = Reverse<["a", "b", "c"]>; // ['c', 'b', 'a']
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 재귀로 튜플의 First와 Rest를 나눠서 First를 맨 뒤로 보내는 방식

> 코드

```typescript
type Reverse<T extends any[]> = T extends [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : T;
```

> 코드 설명

- `T extends any[]` 형태로 튜플 타입 제어
- `T extends [infer First, ...infer Rest]` 형태로 튜플의 First와 Rest를 나눠서 재귀적으로 처리
- `[...Reverse<Rest>, First]` 형태로 Rest를 뒤집은 결과(재귀)에 First를 추가
- 빈 튜플일 경우, T 타입을 그대로 반환
