## 20-Promise.all

> View on GitHub: https://tsch.js.org/20

### 문제

Type the function PromiseAll that accepts an array of PromiseLike objects, the returning value should be Promise<T> where T is the resolved result array.

```ts
const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, "foo");
});

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const);
```

### 정답

```ts
type Awaited<T> = T extends Promise<infer R> ? Awaited<R> : T;

declare function PromiseAll<T extends any[]>(
  values: readonly [...T]
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}>;
```

> 에러 케이스

```ts
declare function PromiseAll<T extends any[]>(
  values: T
): Promise<{ [K in keyof T]: T[K] extends Promise<infer U> ? U : T[K] }>;
```

### 설명

- `PromiseAll` 함수는 배열의 각 요소를 `Promise`로 감싸서 반환하는 함수
- 우선 테스트케이스를 보면 readonly 배열(튜플)과 일반 배열이 모두 존재함
- 따라서 최초 `T`는 any[]로 받고, 이를 튜플로(readonly)로 변환하기 위해 `readonly [...T]`를 사용
- 이후 배열의 각 요소를 `Promise`로 감싸서 반환하기 위해 `Promise<{ [K in keyof T]: Awaited<T[K]>; }>`를 사용
- `{ [K in keyof T]: Awaited<T[K]> }`는 배열의 각 요소를 순회하며 키를 추출하고, 각 요소를 `Awaited<T[K]>`로 변환하여 반환
- `Awaited<T[K]>`는 `T[K]`가 `Promise`라면 `Promise`의 내부 타입을 추출하고, 그렇지 않다면 `T[K]`를 반환

### 추가 질문

> values에 readonly [...T]가 가능한 이유는?

- 기존 `T extends any[]`에서 `T`는 배열이지만 튜플이 될 수도 있고, 일반 배열이 될 수도 있음
- 따라서 `readonly [...T]`를 사용하여 튜플로 변환

```ts
declare function Example<T extends any[]>(values: readonly [...T]): T;
declare function Example2<T extends any[]>(values: T): T;

const test1 = Example([1, 2, 3]); // T = [number, number, number] (튜플)
const test2 = Example2([1, 2, 3]); // T = number[] (일반 배열)
```

- TypeScript는 `readonly [...T]`에 맞춰 `T`를 튜플로 유추하려고 시도함
- `values`가 일반 배열(`number[]`)이면 TypeScript는 가능한 한 `readonly` 속성을 유지하려고 함
- 결과적으로 `T`는 `[number, number, number]`처럼 튜플로 추론됨
- `readonly` 옵션을 붙여주지 않으면 `Example2`처럼 일반 배열로 추론됨

> 왜 Awaited가 필요한가?

- Awaited 대신 `T[K] extends Promise<infer U> ? U : T[K]`를 사용하면 오류 발생
- Typescript에서 조건부 타입(`extends`)를 사용할 때, `T`가 유니온(`A | B`)이면 각각 개별적으로 평가한 후, 결과를 다시 유니온으로 합침
- 이 때, `T[K]` 자체가 유니온 타입이기 때문에(이 문제에서는 `number | Promise<number>`), `T[K]`가 리턴될 경우 `number | Promise<number>`로 추론되어 오류 발생
- 따라서 `Awaited<T[K]>`를 사용하여 `T[K]`가 리턴될 경우 `number`로 추론되도록 함

### Reference

- [Github Answer](https://github.com/type-challenges/type-challenges/issues/508)
