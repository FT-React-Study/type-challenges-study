## [medium] 16259. To Primitive

> View on GitHub: https://tsch.js.org/16259

#### 문제

Please complete type `ToPrimitive<T>`, type `T` inherits from `object`, convert `T` to a primitive type.

> 예시

```ts
type X = {
  name: "Tom";
  age: 30;
  married: false;
  addr: {
    home: "123456";
    phone: "13111111111";
  };
};

type Expected = {
  name: string;
  age: number;
  married: boolean;
  addr: {
    home: string;
    phone: string;
  };
};
```

#### 문제 설명

- 객체를 받아, 객체의 모든 프로퍼티를 기본 타입으로 변환

#### 시도 1 (더러운 정답)

> 접근 방식

- 객체의 프로퍼티를 돌면서 기본 타입으로 변환
- 배열/객체일 경우 재귀적으로 처리

> 코드

```ts
type InferType<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends (...args: any[]) => any
  ? Function
  : T extends any[]
  ? ChangeArray<T>
  : T extends object
  ? { [K in keyof T]: InferType<T[K]> }
  : T;

type ChangeArray<T extends any[]> = {
  [K in keyof T]: InferType<T[K]>;
};

type ChangeObject<T> = T extends (...args: any[]) => any
  ? Function
  : T extends any[]
  ? ChangeArray<T>
  : T extends object
  ? { [K in keyof T]: InferType<T[K]> }
  : T;

type ChangeValue<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;

type ToPrimitive<T extends object> = T extends [...infer R]
  ? InferType<R>
  : {
      [K in keyof T]: T[K] extends object
        ? ChangeObject<T[K]>
        : InferType<T[K]>;
    };
```

> 코드 설명

- 객체의 프로퍼티를 돌면서 기본 타입으로 변환
- 기본 타입일 primitive 타입으로 반환
- 배열/객체일 경우 재귀적으로 처리

- 그런데 중복된 로직이 많은 것 같아서 하나씩 다 걷어내봄

#### 시도 2 (깔끔한 정답)

> 코드

```ts
type PrimitiveType<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends (...args: any[]) => any
  ? Function
  : T extends any[] | object
  ? { [K in keyof T]: PrimitiveType<T[K]> }
  : T;

type ToPrimitive<T extends object> = { [K in keyof T]: PrimitiveType<T[K]> };
```
