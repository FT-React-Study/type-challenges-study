# Week2

# 189 - Awaited

Promise와 같은 타입에 감싸인 타입이 있을 때, 안에 감싸인 타입이 무엇인지 어떻게 알 수 있을까요?

예시: `Promise<ExampleType>`이 있을 때, `ExampleType`을 어떻게 얻을 수 있을까요?

```ts
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

### 문제 분석

```ts
type MyAwaited<T> = any

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>
type T = { then: (onfulfilled: (arg: number) => any) => any }

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>,
  Expect<Equal<MyAwaited<T>, number>>,
]
```

해당 코드를 보면 `MyAwaited`의 제네릭으로 입력된 타입의 반환 타입을 반환하는 코드라는 것을 알 수 있다.

예제들을 보면 여러 경우가 나오는데 3가지로 분류할 수 있다.

#### 예제 케이스 유형1

한번의 `Promise`타입의 반환값

#### 예제 케이스 유형2

 `Promise`가 중첩되어 있는 경우에 최종적으로 반환하는 타입을 반환

#### 예제 케이스 유형3

 Promise와 호환이 되는Thenable 객체의 경우 콜백 함수의 파라미터 타입을 반환



그래서 이 `Awaited`라는 유틸리티 타입의 쓸모를 추측해봤다. 

비동기 함수가 있고 그 함수의 타입을 통해 그 함수가 결국 반환하는 값의 타입이 필요할 때 사용하는 것으로 보인다.



### Infer

> 조건부 타입(extends)과 함께 사용되고, 타입을 추론하도록 한다.

```ts
T extends SomeType<infer U> ? TrueType : FalseType
```

한번에 와닿는 개념은 아니지만, 앞으로 반복해서 볼 듯 해서 완벽히 이해하기보다는 당장 이해되는 부분을 정리해봤다.

먼저 조건부로 쓰일때 True/False로 나뉘는 기준은 `T`타입이 `SomeType<infer U>` 타입과 호환이 되느냐이다.

호환이 되지 않을 경우 `FalseType`영역에 있는 값을 반환한다.



반대의 경우, 즉 T와 `SomeType<infer U>`가 호환이 되는 경우  `SomeType`의 제네릭에 있는 값을 추론한다. 

그 추론한 값을 할당하는데 그 작업을 `infer`뒤에 변수를 두어서 실행한다. 

추론해야하는 값이 있는 위치에 `infer {변수}`를 넣을 경우 조건문에 그 추론한 값이 할당된 `{변수}`를 사용할 수 있는 것이다.



### 접근 1

```ts
type MyAwaited<T> = T extends Promise<infer U> ? U : T
```

이 개념을 통해 이런 타입연산을 할 수 있다.

먼저 T가 `Promise<>`와 호환이 되는지 판단을 한다. 

아닐 경우 그냥 T를 반환한다. 이렇게 그대로 반환하는건 아무 동작도 안한 느낌이기도 하고, 이후 재귀를 할 때 재귀를 끝내는 조건이 되기도 한다.

그리고 호환이 되는 경우에 `U`에 그 추론한 값을 할당한다. `Infer U`가 제네릭 안에 있기 때문에 제네릭에 있을 타입을 추론한다. Promise의 제네릭의 있는 값은 반환값이다.

정리하면 이 연산은 T가 Promise<>라는 타입과 구조적으로 호환되는지 판단해서, 아닌경우 그냥 T를 반환하고 맞을 경우 Promise의 반환값을 반환한다.



하지만 이 경우 위 예제케이스 유형중 1번만 충족하고, 2번과 3번은 만족시키지 못한다.



### 재귀

조건부 타입은 재귀적으로 자신의 타입을 참조할 수 있다.

#### 타입스크립트가 재귀적으로 쓰일 수 있는 이유

타입스크립트는 정적 특성을 가지고 있기 때문이다.

타입스크립트는 컴파일 시점에만 동작하기 때문에 그 값이 변경되지 않는다는 것이 보장되어 있다.

그래서 타입스크립트 컴파일러는 가능한 경로들을 탐색하여 안전하게 타입을 추론할 수 있다.

타입이 동적일 수 있고, 그렇기에 값이 보장되어 있지 않은 런타입 환경에서는 타입 정보는 사용되지 않는다



다만 50단계까지만 타입을 확장해서 탐색할 수 있고 이를 초과할 경우 오류가 발생한다.



특히 타입의 경우 데이터를 연산하는 것이 아니라 단순히 타입을 확장하는 것이기 때문에 정적으로 처리할 수 있다. 



### 접근2

```ts
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T
```

재귀를 쓰는 개념 자체는 간단하다.

중첩된 Promise의 경우 True로 반환된 타입 또한 Promise타입이다. 
그러면 True로 호환되고 다시 그 영역에 있는 자신의 타입에서 평가받는다. 이 과정을 반복한다.

최종 반환값은 Promise가 아니다. 그렇기에 False타입으로 그 자신의 타입을 반환하고 최종 반환값이 나오는 것이다.



이경우에는 

```ts
type T = { then: (onfulfilled: (arg: number) => any) => any };

Expect<Equal<MyAwaited<T>, number>>                 // number
```

이 케이스에서 타입 에러가 뜬다



### Thenable

 `then`메서드를 포함한 객체 혹은 값이다.

then은 후속 동작을 필요로 할 때 쓰이는 메소드이다.



Thenable은 `then` 메서드를 통해 후속 작업을 정의할 수 있으며, Promise는 이러한 Thenable 객체를 감지하고 Promise 체인에 포함시킬 수 있다.

말그대로 그냥 then이 들어간 객체이기 때문에 반드시 비동기 함수는 아니지만 Promise 체인에서는 동기적인 Thenable도 항상 비동기로 처리된다.



예제에서 then메소드의 콜백함수의 파라미터 값의 타입을 반환해야 한다.

thenable에서 반환하는 값을 콜백함수의 파라미터로 전달한다.

그렇기 때문에 Awaited에서 thenable에서 콜백 파라미터의 타입을 반환한다.



### `PromiseLike<T>`

```ts
interface PromiseLike<T> {
  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>,
    onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>
  ): PromiseLike<TResult1 | TResult2>;
}
```

thenable을 일반화한 타입, `then` 메서드를 통해 후속 동작을 정의할 수 있는 모든 객체를 포함

Promise도 이 타입에 서브타입이 된다.

테스트 케이스에서 쓰인 객체도 이 타입에 포함된다.

그렇기 때문에 이 타입을 사용할 경우 이 문제에서 요구하는 답을 전부 찾을 수 있다



### 접근3

 ```ts
 type MyAwaited<T> = T extends PromiseLike<infer U> ? MyAwaited<U> : T
 ```

그래서 그냥 PromisLike를 재귀로 돌려줬더니 케이스들을 다 통과했다.

Thenable은 추론해야할 타입이 PromiseLike의 제네릭에 틀어가 있기 때문에 가능하다.





## Awaited

> 비동기 타입의 최종 반환값을 추출하는 유틸리티 타입

```ts
async function fetchData(): Promise<string> {
  return "data";
}

// `Promise<string>`에서 `string` 추출
type Result = Awaited<ReturnType<typeof fetchData>>; // string
```



## IF

조건 `C`, 참일 때 반환하는 타입 `T`, 거짓일 때 반환하는 타입 `F`를 받는 타입 `If`를 구현하세요. `C`는 `true` 또는 `false`이고, `T`와 `F`는 아무 타입입니다.

예시:

```ts
type A = If<true, 'a', 'b'>  // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'

type If<C, T, F> =  any

type cases = [
  Expect<Equal<If<true, 'a', 'b'>, 'a'>>,
  Expect<Equal<If<false, 'a', 2>, 2>>,
  Expect<Equal<If<boolean, 'a', 2>, 'a' | 2>>,
]

// @ts-expect-error
type error = If<null, 'a', 'b'>
```

### 문제 분석

두개의 항 중에서 true면 제네릭의 두번째 인자를 false면 제네릭의 세번째 인자를 반환한다.

이 내용까지만 봤을 떄는 간단한 식이 바로 떠오르지만, 세번째 케이스처럼 boolean인 경우에 두개의 유니온 타입을 반환해야 한다.



### 첫번째 접근

먼저 null이 들어갔을 때 error를 발생시켜야 하기 때문에 C의 타입을 한정시켜줘야 한다.

```ts
type If<C extends boolean, T, F> =  any
```

타입을 한정시켜주기 위해 extends를 쓰는것은 반복적으로 해왔던 것이라서 이제는 바로 적용할 수 있었다.



그리고 마찬가지로 조건문으로 쓸 수 있다는 점으로

```ts
type If<C extends boolean, T, F> = C extends true ? T : F
```

를 구상할 수 있었다.



첫번째 접근을 했을 때 3번째 케이스는 이후 해결하려고 했는데 위 답으로 해결이 됐다.



뭔가 했더니 앞에 언급됐던 분배 법칙과 관련이 있었다.



#### 분배 법칙

유니온 타입의 뒤쪽에 extends가 입력된 경우 유니온 타입의 개별 타입들이 하나씩 뒤의 타입에 extends 적용되는 방식으로 동작한다.

`boolean`은 true와 false의 유니온 타입이기 때문에 제네릭의 두번째 값과 세번째 값의 유니온 타입으로 반환하는 것이다.
