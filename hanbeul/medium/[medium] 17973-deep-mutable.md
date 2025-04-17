## [medium] 17973. DeepMutable

> View on GitHub: https://tsch.js.org/17973

#### 문제

Please complete type `DeepMutable<T>`, type `T` inherits from `object`, convert `T` to a mutable object.

> 예시

```ts
type X = {
  readonly a: () => 1;
  readonly b: string;
  readonly c: {
    readonly d: boolean;
    readonly e: {
      readonly g: {
        readonly h: {
          readonly i: true;
          readonly j: "s";
        };
        readonly k: "hello";
      };
    };
  };
};

type Expected = {
  a: () => 1;
  b: string;
  c: {
    d: boolean;
    e: {
      g: {
        h: {
          i: true;
          j: "s";
        };
        k: "hello";
      };
    };
  };
};
```

#### 문제 설명

- 객체를 받아, 객체의 모든 프로퍼티를 가변 타입(not readonly)으로 변환

#### 시도 1

> 접근 방식

- 객체의 프로퍼티를 돌면서 가변 타입으로 변환
- 객체일 경우 재귀적으로 처리

> 코드

```ts
type isNotPureObject<T extends object> = T extends [...infer _]
  ? true
  : T extends () => {}
  ? true
  : false;

type DeepMutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object
    ? isNotPureObject<T[K]> extends false
      ? DeepMutable<T[K]>
      : T[K]
    : T[K];
};
```

> 코드 설명

- 객체의 프로퍼티를 순회하면서 가변 타입으로 변환
- 객체일 경우 재귀적으로 처리
- 배열 및 함수일 경우 확인해서 그대로 반환
