## 189-Awaited

> View on GitHub: https://tsch.js.org/189

### 문제

`Promise`와 같은 타입에 감싸인 타입이 있을 때, 안에 감싸인 타입이 무엇인지 어떻게 알 수 있을까요?

예시: `Promise<ExampleType>`이 있을 때, `ExampleType`을 어떻게 얻을 수 있을까요?

### 정답

```ts
type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T;
```

### 설명

- `T`가 `PromiseLike`라면 `infer`를 사용하여 내부 타입 `U`를 추출하고, 재귀적으로 `MyAwaited<U>`를 호출
- `T`가 `PromiseLike`가 아니라면 최종적으로 `T`를 반환

### 추가 질문

> 왜 `PromiseLike`를 사용하는가?

- `PromiseLike`는 `Promise`와 비슷한 타입을 나타내는 인터페이스
- `PromiseLike`는 `then` 메서드만 지원, `catch`나 `finally` 메서드는 지원하지 않음
- `{ then: (onfulfilled: (arg: number) => any) => any }`를 처리하기 위해 `Promise`가 아닌 `PromiseLike`를 사용 (Promise가 성립하려면 `catch`와 `finally`가 있어야 함)

```ts
interface Promise<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): Promise<TResult1 | TResult2>;

  catch<TResult = never>(
    onrejected?: (reason: any) => TResult | PromiseLike<TResult>
  ): Promise<T | TResult>;

  finally(onfinally?: (() => void) | null): Promise<T>;
}
```

```ts
interface PromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2>;
}
```

> `infer`란 무엇인가?

- `infer` 키워드는 조건부 타입에 사용되며, 조건식이 참으로 평가될 때 사용할 수 있는 타입을 추론하는 데 필요한 도구
- `infer` 키워드는 컨디셔널 타입과 함께 사용되어야 함
- 컨디셔널 타입에서 추론하고자 하는 타입에 `infer` 키워드를 사용하여 추론

- `infer`를 활용해 배열의 요소 타입, Promise의 결과 타입, 함수의 반환 타입을 추출할 수 있다.

```ts
// 배열의 요소 타입 추출
type ElementType<T> = T extends (infer U)[] ? U : T;

type Test1 = ElementType<number[]>; // number
type Test2 = ElementType<string[]>; // string
type Test3 = ElementType<boolean>; // boolean (배열이 아니므로 그대로 반환)
```

```ts
// Promise의 결과 타입 추출
type AwaitedType<T> = T extends Promise<infer U> ? U : T;

type Test1 = AwaitedType<Promise<string>>; // string
type Test2 = AwaitedType<Promise<number>>; // number
type Test3 = AwaitedType<number>; // number (Promise가 아니므로 그대로 반환)
```

```ts
// 함수의 반환 타입 추출
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Test1 = ReturnType<() => string>; // string
type Test2 = ReturnType<(x: number) => void>; // void
type Test3 = ReturnType<number>; // never (함수가 아니므로)
```

### Reference

- [type-challenges/issues/33382](https://github.com/type-challenges/type-challenges/issues/33382)
- [Array vs ArrayLike, Promise vs PromiseLike](https://yceffort.kr/2021/11/array-arraylike-promise-promiselike)
- [초고수 성현님의 TS infer에 관한 글](https://witch.work/posts/typescript-infer-usage)
- [infer란?](https://velog.io/@minh0518/infer란)
