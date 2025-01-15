# TS Types - Week 2

## [Easy-189-Awaited](./easy/easy-189-awaited.ts);

최종적으로 반환되는 타입을 추출하는 타입

```ts
type MyAwaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? MyAwaited<V>
    : never
  : T;
```

- `T extends null | undefined` : T가 null 또는 undefined인 경우, T를 반환합니다.
- `T extends object & { then(onfulfilled: infer F, ...args: infer _): any }` : T가 object이고 then 메서드를 가지고 있는 경우(Promise 타입인 경우), 해당 then 메서드의 첫 번째 매개변수(onfulfilled)를 추출하여 F로 정의합니다.
- `F extends (value: infer V, ...args: infer _) => any` : onfulfilled 메서드의 첫 번째 매개변수 value를 추출하여 V로 정의한 경우, `MyAwaited<V>`를 반환합니다.
- `T` : 위의 조건을 모두 만족하지 않는 경우, T를 반환합니다. (Promise 타입이 아니게 된, 최종적으로 resolved된 타입을 반환)

### Promise 타입

1. Promise Constructor

- 이는 Promise 생성자 함수의 타입
- new, resolve, reject 메서드를 가지고 있는 객체를 정의하는 타입

```ts
const promise = new Promise<string>((resolve, reject) => {
  resolve("Hello, world!");
});
```

2. Promise<T>

- 이는 Promise 생성자의 제네릭 타입으로, 생성된 Promise 객체의 타입
- then, catch, finally 메서드를 가지고 있는 객체를 정의;
- then 메서드는 onfulfilled, onrejected 매개변수를 가지고 있는 함수를 정의

```ts
const promise = new Promise<string>((resolve, reject) => {
  resolve("Hello, world!");
});

const onFulfilled = (value: any) => {
  // ...
};
const onRejected = (reason: any) => {
  // ...
};
const onFinally = () => {
  // ...
};

promise.then(onFulfilled, onRejected).catch(onRejected).finally(onFinally);
```

## [Easy-268-Easy-If]

```ts
type If<C extends boolean, T, F> = C extends true ? T : F;
```

- C: Condition
- T: True 시 반환되는 타입
- F: False 시 반환되는 타입

## [Easy-533-Easy-Concat]

## [Easy-898-Easy-Includes]

## [Easy-3057-Easy-Push]

## [Easy-3060-Easy-Unshift]

## [Easy-3312-Easy-Parameters]
