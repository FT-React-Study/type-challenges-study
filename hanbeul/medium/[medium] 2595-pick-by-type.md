# 2595 - Pick By Type

## 문제

`T`에서 `U` 타입을 할당할 수 있는 속성만 선택하는 `PickByType<T, U>`를 구현하세요.

> 예시

```ts
type OnlyBoolean = PickByType<
  {
    name: string;
    count: number;
    isReadonly: boolean;
    isEnable: boolean;
  },
  boolean
>; // { isReadonly: boolean; isEnable: boolean; }
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 1130-replace-keys 문제를 참고하여 각 key-value를 순회하여 value의 타입을 확인해보자

> 코드

```ts
type PickByType<T, U> = { [K in keyof T as T[K] extends U ? K : never]: T[K] };
```

> 코드 설명

- `T[K] extends U ? K : never` 조건의 키-리맵핑을 통해 T[K]의 타입이 U에 할당 가능한 경우, 해당 키만 남기고 나머지는 제거
