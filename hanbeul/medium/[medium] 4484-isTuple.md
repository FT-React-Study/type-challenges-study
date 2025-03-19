## [medium] 4484. IsTuple

#### 문제

`IsTuple`이라는 타입을 구현하세요. 이 타입은 입력 타입 `T`를 받아서 `T`가 튜플 타입인지 여부를 반환합니다.

> 예시

```typescript
type case1 = IsTuple<[number]>; // true
type case2 = IsTuple<readonly [number]>; // true
type case3 = IsTuple<number[]>; // false
```

> 문제 설명

- 이 문제는 입력 타입 T가 튜플인지 여부를 확인하는 타입을 구현하는 것입니다.
- 튜플은 고정된 길이를 가진 배열 타입으로, 각 요소의 타입이 개별적으로 정의될 수 있습니다.
- 일반 배열과 튜플을 구분할 수 있어야 합니다.
- readonly 튜플도 처리할 수 있어야 합니다.

#### 시도1 (정답)

> 접근 방법

- 튜플은 고정된 길이를 가진 배열 타입이므로 readonly인지, 그리고 길이가 존재하는지 확인

> 코드

```ts
type IsTuple<T> = [T] extends [never]
  ? false
  : T extends readonly any[]
  ? number extends T["length"]
    ? false
    : true
  : false;
```

> 코드 설명

- 우선 never인 경우 false 처리
- 그 다음, T가 readonly 배열인지 확인
- readonly 배열인 경우, 길이가 number인지 확인(길이를 확인할 수 있는지)
