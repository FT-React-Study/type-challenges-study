## 8-Readonly 2

> View on GitHub: https://tsch.js.org/8

### 문제

`T`에서 `K` 프로퍼티만 읽기 전용으로 설정해 새로운 오브젝트 타입을 만드는 제네릭 `MyReadonly2<T, K>`를 구현하세요. `K`가 주어지지 않으면 단순히 `Readonly<T>`처럼 모든 프로퍼티를 읽기 전용으로 설정해야 합니다.

### 정답

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly [P in keyof T as P extends K ? P : never]: T[P];
} & { [P in keyof T as P extends K ? never : P]: T[P] };
```

### 설명

- 3-omit 문제에서 사용한 `as`를 활용한 필터링 기능 사용
- 첫 번째 집합에는 `K`에 할당할 수 있는 T의 키 값인 P에 대해서는 `readonly` 키워드를 붙이고, 그렇지 않은 키 값에 대해서는 제거
- 두 번째 집합에는 `K`에 할당할 수 있는 T의 키 값인 P에 대해서는 제거, 그렇지 않은 키 값에 대해서는 기존 타입 유지
- 두 집합을 intersection 타입으로 합치면 원하는 타입이 완성

### 추가 질문

> 왜 두 집합을 union 타입으로 합치면 안되는걸까?

```ts
type MyReadonly2<T, K extends keyof T = keyof T> =
  | {
      readonly [P in keyof T as P extends K ? P : never]: T[P];
    }
  | { [P in keyof T as P extends K ? never : P]: T[P] };
```

- union 타입으로 합칠 경우 readonly 프로퍼티를 가진 객체와 그렇지 않은 객체로 분리됨

```ts
type Example = { foo: string; bar: number; baz: boolean };

type Result = MyReadonly2<Example, "foo" | "bar">;
// Result = { readonly foo: string; readonly bar: number } | { baz: boolean };
```

> Intersection은 교집합인데, 왜 서로 다른 타입을 합치는 것처럼 보이는걸까?

- 첫 번째 집합과 두 번째 집합은 key가 서로 다른 객체이다.
- 그렇다면 intersection(교차) 타입은 두 집합의 교집합(공집합)을 반환해야 하는 것이 아닌가?

- TypeScript에서 교차 타입은 교집합이 아니라 두 타입을 "결합"한 새로운 타입을 반환
- 두 개 이상의 타입을 조합하여 하나의 타입을 만들어 각 타입의 속성을 모두 포함하는 타입이 생성됨

```ts
type A = { foo: string };
type B = { bar: number };
type C = A & B;

// 결과 타입: { foo: string; bar: number }
```

- 교차 타입의 결합 방식 1) 두 타입에 동일한 키가 있는 경우

```ts
type A = { foo: string };
type B = { foo: string };
type C = A & B;
// 결과: { foo: string }
```

- 교차 타입의 결합 방식 2) 두 타입에 동일한 키가 있지만 값의 타입이 다른 경우

```ts
type A = { foo: string };
type B = { foo: number };
type C = A & B;
// 결과: { foo: never }
```

- 교차 타입의 결합 방식 3) 서로 다른 키를 가지는 경우

```ts
type A = { foo: string };
type B = { bar: number };
type C = A & B;
// 결과: { foo: string; bar: number }
```

- 교차 타입의 결합 방식 4) 함수 타입의 경우(모든 시그니처를 동시에 만족해야 함)

```ts
// 예시1
type A = (x: number) => string;
type B = (x: number) => number;
type C = A & B;

// C는 두 시그니처를 모두 만족해야 함
const fn: C = (x: number) => {
  if (x > 0) return "string";
  return 123; // 타입 에러 (반환 타입이 모두 만족하지 않음)
};

// 예시2
type A = (x: string) => number;
type B = (x: number) => string;

type C = A & B;

const fn: C = (x: any) => {
  if (typeof x === "string") return x.length; // x가 string일 때 number 반환
  if (typeof x === "number") return x.toString(); // x가 number일 때 string 반환
};
```

### Reference
