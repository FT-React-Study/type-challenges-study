# week4

## 15 - Last of Array

> 이 챌린지에는 TypeScript 4.0 사용이 권장됩니다.

배열 `T`를 사용하고 마지막 요소를 반환하는 제네릭 `Last<T>`를 구현합니다.

예시

```ts
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type tail1 = Last<arr1> // expected to be 'c'
type tail2 = Last<arr2> // expected to be 1
```

```ts
type cases = [
  Expect<Equal<Last<[]>, never>>,
  Expect<Equal<Last<[2]>, 2>>,
  Expect<Equal<Last<[3, 2, 1]>, 1>>,
  Expect<Equal<Last<[() => 123, { a: string }]>, { a: string }>>,
]
```



### 문제 분석

배열에서 마지막 타입을 반환해야 한다.



### 첫번째 접근

```ts
type LastFirst<T extends any[]> = T[T['length']-1];
```

알고리즘 풀이에서 익숙한 방법으로 해봤는데 안됐다.



#### T['length']

> **길이(length)**를 나타내는 타입 수준의 표현

```ts
interface Array<T> {
  readonly length: number;
  ...
  pop(): T | undefined;
  push(...items: T[]): number;
  ...
}
```



`	T['length']`는 길이가 정해진, 즉 튜플의 길이를 정하는 것이다. 

```ts
type T1 = [string, number, boolean];
type Length1 = T1['length']; // 3
```

배열의 길이에는 항상 number를 반환한다.

```ts
type T2 = string[];
type Length2 = T2['length']; // number
```

그렇기 때문에 단순 배열을 대상으로 하는 위 식에서는 number - 1이라는 연산이 되어서 에러가 발생한다.



### 두번째 접근

First of array의 예시 정답중에 infer와 구조 분해를 이용한 방법이 있었던 것이 생각나 유사하게 재현했다

``` ts
type Last<T extends any[]> = T extends [...infer _Rest, infer Last] ? Last : never;
```

#### infer와 구조분해

infer를 통해 배열의 위치 별로 선언이 가능하다.

또한 스프레드 연산자를 통해 `나머지 요소`를 선언할 수 있다.

특정 위치에서 특정 요소를 선언하고, 그 선언된 요소 외의 나머지 요소를 선언 위치/순서에 따라 한번에 선언할 수 있다.



타입스크립트 시스템에서 동작하는 개념이지만, 자바스크립트에서의 구조분해 할당 및 나머지 선언과 똑같다.

```ts
T extends SomeType ? [구조분해] : [다른 결과]
```



infer가 구조 분해의 구조로 쓰이는 것을 보고 infer에 대해 좀 더 이해도가 높아졌다.

extends와 조건문이 함께 쓰인다.

 extends 앞에 있는 타입을 뒤에 있는 infer가 포함된 타입에 할당을 했을 때, 그 infer 변수 타입이 참이 된다는 것

=> 실제 타입에서 해당 타입이 그 위치에 있다는 것

true일때 그 값을 가지고 변수를 가져오는 것도 이 개념으로 이해하니 맞아 떨어졌다.

그렇기 때문에 infer는 타입의 특정 위치에 있는 값을 변수로 빼는 느낌으로 동작한다.



#### infer가 false인 경우

같은 맥락으로 infer가 false라면 애초에 추론을 할 수가 없다는 것이다.

#### 첫번째 : extends가 안되는 경우

`infer`로 추론해야 하는 타입이 그 위치에 있다할 때 전체 구조 자체가 extends가 안되는 경우에 false로 간다

```ts
type ExtractString<T> = T extends { value: infer R } ? R : never;

type Result1 = ExtractString<{ value: string }>; // string (추론 성공)
type Result2 = ExtractString<{ key: number }>; // never (추론 실패)
```

속성이 다르거나

```ts
type LastElement<T> = T extends [...infer Rest, infer L] ? L : never;

type Result1 = LastElement<[1, 2, 3]>; // 3 (추론 성공)
type Result2 = LastElement<number>; // never (추론 실패)
```

```ts
type ExtractArrayElement<T> = T extends Array<infer E> ? E : never;

type Result1 = ExtractArrayElement<string[]>; // string (추론 성공)
type Result2 = ExtractArrayElement<number>; // never (추론 실패)
```

```ts
type ExtractFunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type Result1 = ExtractFunctionReturnType<() => string>; // string (추론 성공)
type Result2 = ExtractFunctionReturnType<number>; // never (추론 실패)
```

아예 형태가 다르거나 할 때 extends가 안되기 때문에

#### 두번째 : infer가 적용될 부분이 존재하지 않을때

하지만 문제의 예시대로면 형태만 봤을 때 `[...infer R]`과 []는 똑같이 배열 형식이기 때문에 위의 예시랑은 좀 다르다.

이 경우 ...infer R이라는 나머지 요소 할당하는 연산자가 작동을 해야 하는데 하지 못하기 때문에 false로 판단이 된다.



빈 배열에서는 ...으로 나머지를 받을 요소가 없고, 그러면서 false로 판단이 되는 것이다.



## 16 - Pop

배열 `T`를 사용해 마지막 요소를 제외한 배열을 반환하는 제네릭 `Pop<T>`를 구현합니다.

예시

```
type arr1 = ['a', 'b', 'c', 'd']
type arr2 = [3, 2, 1]

type re1 = Pop<arr1> // expected to be ['a', 'b', 'c']
type re2 = Pop<arr2> // expected to be [3, 2]
```



**더보기**: 비슷하게 `Shift`, `Push` 그리고 `Unshift`도 구현할 수 있을까요?

```ts
type Pop<T extends any[]> = any

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Pop<[3, 2, 1]>, [3, 2]>>,
  Expect<Equal<Pop<['a', 'b', 'c', 'd']>, ['a', 'b', 'c']>>,
  Expect<Equal<Pop<[]>, []>>,
]
```



### 문제 분석

기존 배열에서 마지막 항을 뺀 후 반납하는 pop이랑은 다르게 배열 타입에서 마지막 항을 뺸 후 마지막 항이 빠진 나머지 배열 타입을 반환한다.



### 첫번째 접근

```ts
type Pop<T extends any[]> = T extends [...infer Rest, infer _Last] ? Rest : []
```

이전 문제랑 세트 느낌이라 쉽게 풀 수 있었다.



### Promise.all

```ts
Type the function PromiseAll that accepts an array of PromiseLike objects, the returning value should be Promise<T> where T is the resolved result array.

const promise1 = Promise.resolve(3);
const promise2 = 42;
const promise3 = new Promise<string>((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});

// expected to be `Promise<[number, 42, string]>`
const p = PromiseAll([promise1, promise2, promise3] as const)

const promiseAllTest1 = PromiseAll([1, 2, 3] as const)
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const)
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)])
const promiseAllTest4 = PromiseAll<Array<number | Promise<number>>>([1, 2, 3])

type cases = [
  Expect<Equal<typeof promiseAllTest1, Promise<[1, 2, 3]>>>,
  Expect<Equal<typeof promiseAllTest2, Promise<[1, 2, number]>>>,
  Expect<Equal<typeof promiseAllTest3, Promise<[number, number, number]>>>,
  Expect<Equal<typeof promiseAllTest4, Promise<number[]>>>,
```

### 문제 분석

function으로 PromiseAll이라는 함수에 typeof를 붙일 경우 Promise 유틸리티 타입을 반환한다



### 정답

```ts
  declare function PromiseAll<T extends readonly unknown[]>(
    values: [...T]
  ): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
```



#### 제네릭 타입 변수

[공식문서](https://www.typescriptlang.org/ko/docs/handbook/2/generics.html#%EC%A0%9C%EB%84%A4%EB%A6%AD%EC%9D%98-hello-world-hello-world-of-generics)

지금까지 타입 추론에 infer를 주로 사용해왔다.

함수의 경우 함수의 파라미터 타입을 추론해서 제네릭으로 받은 후, 반환 타입에서도 사용할 수 있다.



제네릭의 타입은 인수의 타입을 캡쳐하고 이 정보를 사용할 수 있다

```ts
function identity<Type>(arg: Type): Type {
  return arg;
}
```

함수가 실행될 때 T가 결정된다. 그렇기 때문에 매개변수 타입을 각각 매핑해서 프로미스의 튜플 타입으로 반환하는 형식이 된다.



#### T와 [...T]의 차이

제네릭에서 매개변수의 변수를 readonly 튜플 타입이 아니라 일반 배열로 추론하게 됨

T전체의 타입을 추론하기 때문에 readonly 리터럴 타입이 아닌 배열 타입으로 추론

하지만 [...T]의 경우 T를 분해한 후 새로운 튜플을 생성한다.



새로운 튜플을 생성할때 이전 타입을 가져오고 readonly 튜플 타입을 유지한다



#### { [K in keyof T]: [T]K }

include에서 봤던 매핑된 타입 형식이다

여기서 헷갈린건 처음에 이를 익힐 때 객체 형식일거라고 생각했다. {}를 쓰기 때문이다.

하지만 튜플 형식으로 반환한다.



그렇기 때문에 인자에서 추론한 튜플 타입을 하나씩 매핑해서 해당 인자에 맞는 awaited 반환 타입을 다시 튜플 타입으로 매핑할 수 있다



##





