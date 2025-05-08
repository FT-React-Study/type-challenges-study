## [medium] 29650. Extract To Object

> View on GitHub: https://tsch.js.org/29650

#### 문제

Implement a type that extract prop value to the interface. The type takes the two arguments. The output should be an object with the prop values. Prop value is object.

> 예시

```ts
type Test = { id: "1"; myProp: { foo: "2" } };
type Result = ExtractToObject<Test, "myProp">; // expected to be { id: '1', foo: '2' }
```

#### 문제 설명

- 타입 `T`에서 주어진 키 `U`의 값을 추출하여 새로운 객체 타입을 반환
- 추출된 값은 객체 타입

#### 시도 1 (정답)

> 접근 방식

- U에 속하는 놈은 날려버리고, U에 대한 놈만 꺼내와서 풀어준 뒤 두 객체 합치기

> 코드

```ts
type MergedObject<T extends object> = {
  [K in keyof T]: T[K];
};

type ExtractToObject<T, U extends keyof T> = U extends keyof T
  ? MergedObject<{ [K in keyof T as K extends U ? never : K]: T[K] } & T[U]>
  : T;
```

> 코드 설명

- `MergedObject<T>`: 주어진 객체 `T`의 모든 키와 값을 포함하는 새로운 객체 타입을 생성
- `K`는 `T`의 키 값을 순회, 만약 해당 키 값이 `U`에 `extends`되지 않는 경우만 남긴 객체 생성
- 마지막으로 해당 객체와 `T[U]`를 합치기
