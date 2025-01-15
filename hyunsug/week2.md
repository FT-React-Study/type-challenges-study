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

```ts
type Concat<T extends any[], U extends any[]> = [...T, ...U];
```

- T, U: 각각 배열 타입
- spread operator를 이용하여 배열을 합치는 타입

## [Easy-898-Easy-Includes]

1. 처음 풀이

```ts
type Includes<T extends any[], U> = U extends T[number] ? true : false;
```

- T: 배열 타입
- U: 배열 타입의 요소 타입
- `T[number]` : T의 요소들의 타입
- `U extends T[number]` : U가 T의 요소들의 타입 중 하나라면 true, 아니면 false

2. 두번째 풀이

- 테스트 케이스 중 정답과 다른 케이스들이 있음

```ts
// 실패하는 케이스들
type A = Includes<[boolean, 2, 3, 5, 6, 7], false>;
type B = Includes<[{ a: "A" }], { readonly a: "A" }>;
type C = Includes<[{ readonly a: "A" }], { a: "A" }>;
type D = Includes<[1], 1 | 2>;
type E = Includes<[1 | 2], 1>;
```

- 타입 추론 과정에서 문제가 있는 것으로 보임
- A: U extends T[number] 과정에서 `false extends boolean`에 의해 true로 추론됨, 이는 원하는 결과가 아님
- B, C: 읽기전용 속성을 가지고 있는 객체와 읽기전용 속성을 가지고 있지 않은 객체가 동일한 타입으로 추론됨
- D, E: Union 타입과 관련된 문제가 있음
  - D의 경우 `1 | 2 extends 1`은 false이지만, `U extends T[number]`에서는 `1 | 2 extends 1`로 잘못 비교됨
  - E의 경우 배열 요소가 Union 타입일 때 `1 extends 1 | 2`는 true이지만, 정확한 타입 일치 여부를 확인해야 함

Union 관련, 객체 타입 비교, boolean 타입 비교에서 문제가 있는 것으로 나타남  
정확한 타입의 비교가 필요하다는 것을 알 수 있음

[참고 - TS PR](https://github.com/microsoft/TypeScript/issues/27024)
[참고 - 블로그](https://kscodebase.tistory.com/643)

```ts
type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <P>() => P extends B
  ? 1
  : 2
  ? true
  : false;
```

두 타입이 동일한지 확인하는 타입으로 이를 이용하여 타입 비교를 보다 정확하게 할 수 있음

```ts
type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Equal<F, U> extends true
    ? true
    : Includes<R, U>
  : false;
```

- 배열의 요소를 순회하면서 요소와 U의 타입을 비교
- 비교 결과가 true라면 true를 반환, 아니라면 다음 요소와 비교
- 모든 요소를 비교한 후에도 일치하는 요소가 없다면 false를 반환

## [Easy-3057-Easy-Push]

## [Easy-3060-Easy-Unshift]

## [Easy-3312-Easy-Parameters]

```

```

```

```
