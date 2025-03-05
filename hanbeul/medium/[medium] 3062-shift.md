# 3062 - Shift

## 문제

제네릭 `Shift<T>`를 구현하세요. 이는 `T`의 첫 번째 요소를 제거한 배열을 반환합니다.

> 예시

```ts
type Result = Shift<[3, 2, 1]>; // [2, 1]
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 빈 배열 처리 후, infer를 통해 맨 앞의 요소를 날릴 수 있지 않을까?

> 코드

```ts
type Shift<T extends any[]> = T extends []
  ? []
  : T extends [infer _, ...infer Rest]
    ? [...Rest]
    : [];
```

> 코드 설명

- 최초 `T extends []` 처리로 빈 배열 처리
- `infer`를 통해 맨 앞의 요소를 선택해 나머지 배열을 반환
