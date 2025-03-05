# 2852 - Omit By Type

## 문제

`T`에서 `U` 타입에 할당할 수 없는 속성들의 집합을 선택하세요.

> 예시

```typescript
type OmitBoolean = OmitByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { name: string; count: number }
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 키 값 순회하면서 키 리맵핑으로 조건부 처리

> 코드

```ts
type OmitByType<T, U> = { [K in keyof T as T[K] extends U ? never : K]: T[K] };
```

> 코드 설명

- `T[K] extends U ? never : K`를 통해 값 타입이 `U`에 할당 가능한지 확인
- `T[K]` 타입이 `U` 타입에 할당할 수 없는 경우 `never` 처리(키-값 쌍 제거)
