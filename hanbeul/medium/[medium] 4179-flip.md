# [medium] 4179-flip

#### 문제

객체의 키와 값을 서로 바꾸는 타입을 구현하세요.

> 제약사항

1. 객체의 값은 string, number, boolean 타입만 가능합니다.
2. 키가 될 수 있는 타입은 string, number, symbol만 가능하므로, 새로운 키는 반드시 문자열로 변환되어야 합니다.
3. 중첩된 객체는 지원하지 않습니다.
4. 배열과 같이 객체의 키가 될 수 없는 값들은 지원하지 않습니다.

> 예시

```typescript
Flip<{ a: "x"; b: "y"; c: "z" }>; // {x: "a", y: "b", z: "c"}
Flip<{ a: 1; b: 2; c: 3 }>; // {1: "a", 2: "b", 3: "c"}
Flip<{ a: false; b: true }>; // {false: "a", true: "b"}
```

#### 시도 1

> 접근 방식

- 우선 객체의 키 값들을 keyof로 순회한다.
- 순회한 키 값으로 T[K]를 키 값으로, K를 value 값으로 넣으면 되지 않을까?

> 코드

```typescript
type Flip<T> = { [K in keyof T as T[K] extends PropertyKey ? T[K] : never]: K };
```

> 실패 이유

- boolean 값이 키 값으로 안들어가지는 이슈가 있음
- PropertyKey는 string, number, symbol 타입만 가능하므로, boolean 값이 키 값으로 들어가지 않음

#### 시도 2 (정답)

> 접근 방식

- 1번 시도와 마찬가지로 접근
- 키 값을 `PropertyKey`로 제한하는 대신, `string`, `number`, `boolean` 타입을 키 값으로 사용할 수 있도록 제한
- 이후 키 값을 문자열로 변환하여 사용

> 코드

```typescript
type Flip<T> = {
  [K in keyof T as T[K] extends string | number | boolean
    ? `${T[K]}`
    : never]: K;
};
```

> 코드 설명

- `T[K] extends string | number | boolean` 형태로 키 값을 제한
- 이후 키 값을 문자열로 변환하여 사용
- 기존 키 값은 밸류 값으로 사용
