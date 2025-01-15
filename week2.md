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



## Concat

```ts
type Concat<T, U> = any

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

const tuple = [1] as const

type cases = [
  Expect<Equal<Concat<[], []>, []>>,
  Expect<Equal<Concat<[], [1]>, [1]>>,
  Expect<Equal<Concat<typeof tuple, typeof tuple>, [1, 1]>>,
  Expect<Equal<Concat<[1, 2], [3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Concat<['1', 2, '3'], [false, boolean, '4']>, ['1', 2, '3', false, boolean, '4']>>,
]

// @ts-expect-error
type error = Concat<null, undefined>
```



### 문제 분석

두가지 배열을 합친 배열을 반환하는 것으로 보인다.

킥은 [1] as const 에서 추론한 타입을 합쳐서 [1, 1]로 만들어야 한다는 점이다



### 첫번째 접근

처음에는 배열을 유니온 타입으로 바꿔주는 `T[number]`가 떠올랐다.

T와 U는 

```ts
type Concat<T extends unknown[], U extends unknown[]> = T[number] | U[number];
```

두 유니온 타입을 합치는건 쉬웠지만 유니온 타입을 튜플로 바꾸는건 복잡해서 잘못된 방향이라는 것을 느꼈다



### 두번째 접근

찾아보니 익숙한 방식이었다.

배열속에 스프레드 연산자를 붙인 두개의 배열을 넣어주는 것이다.

```ts
type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
```



#### 스프레드 연산자- 1

타입에서 스프레드 연산자는 객체 타입에서는 사용할 수 없다는 점에서 자바스크립트의 스프레드 연산자와 다르지만,

배열과 튜플 형식에서는 같은 방식으로 동작한다.



### 세번째 접근

이 경우에는 세번째 케이스가 오류가 났다

세번째 케이스는 [1] as const로

[1]이라는 배열을 리터럴 타입으로 고정한 것이다.



앞서 언급했던 부분이기도 한데 as const는 리터럴 값으로 만들면서 동시의 readonly 속성 또한 가지게 한다

```ts
type Concat<T extends readonly unknown[], U extends readonly unknown[]> = [...T, ...U]
```



#### mutable한 리터럴 타입

이렇게 답을 구하고 나니 오히려 혼란스러운 부분이 있었다

애초에 [1,2] 타입과 [3, 4] 타입이라는 리터럴 타입을 합치는 동작일때는 

T와 U를 readonly타입으로 제한하지 않았음에도 오류가 나지 않았다는 점이다.



`as const`로 리터럴 타입 선언할때도 이해하기를 리터럴 타입은 readonly여야 하기 때문에 readonly도 자동으로 붙는다

라고 이해했었다.



하지만 이건 잘못된 이해였다.

리터럴 타입도 변경 가능한 - mutable한 타입이 가능하다.



원시 타입이 아닌 경우 리터럴 타입도 mutable할 수 있다.



#### readonly

이전에 원시타입에 readonly를 못붙히는 것데 대해서 이야기가 나왔었는데, 그 이유를 이번 기회로 학습했다

원시타입은 기본적으로 불변하기 때문에 readonly속성을 주지 않아도 readonly이다.



그런데 배열, 객체, 클래스의 속성과 같은 참조타입은 기본이 mutable이다

mutable하기 때문에 오히려 readonly를 붙일 수 있는 것이다.

```ts
const a = 1 as const
type Concat<T extends number> = T

Expect<Equal<Concat<typeof a>, 1>>,

```

차이를 알기 위해 똑같은 방식의 위의 예를 만들어 봤는데 이경우에는 그냥 number여도 오류가 나지 않는다

어차피 불변성을 가지고 있기 때문이다.



#### mutable한 리터럴 타입이 unknown[]에 할당 가능

그래서 다시 왜 그냥 mutable한 배열 타입이 unknown[]이라는 배열 타입에 할당가능하고 readonly인 경우 오류가 뜨는지가 관건이다. 

처음에는 리터럴 타입이여서 그런거라 생각했지만, mutable한 경우에는 할당이 되기 때문에 그건 아니다.

unknown[], number[]와 같은 배열 타입은 정확히는 '길이가 고정되지 않은 배열'을 의미한다. 그리고 그냥 [1,2]와 같은 배열 타입은 mutable하고 즉 길이가 바뀔 수 있기 때문에 unknown[]에 할당 가능한(extends) 것이다

반대로 readonly [1,2]와 같은 불변한 리터럴 타입은 길이가 고정되어 있기 때문에 unknown[]에 할당이 되지 않는다



이부분은 18-length of tuple에서도 적용된 개념이었는데 이때는 정확히 이해하지 못하고 이번에 파악한 부분이다.



#### mutable한 리터럴 타입이 readonly unknown[]에 할당 가능

그러면 또 궁금해지는게 mutable한 경우 길이가 고정되지 않는 타입인 unknown[]에 할당 가능하고

readonly는 readonly unknown[]에 할당 가능한데

mutable한 리터럴 타입은 왜 readonly unknown[] 타입에 할당 가능한지이다. 

이건 readonly unknown[]타입이 둘다 할당할 수 있는 타입이라는 의미인데 직관적으로 와닿지는 않았다.

개념상 readonly가 더 좁은 개념인데 왜 두개를 다 포괄하는? 개념이 readonly일 수 있는건가 혼란스러웠다.



이런 개념으로 그나마 이해할 수 있었다. 

readonly 타입은 읽기 전용 타입인데 mutable타입은 쓰기도 가능하고 읽기도 가능하다

즉 읽기 가능하기 때문에 읽기 가능한 타입이라는 readonly 배열 타입에도 할당이 되는 것이다.



extends의 할당 가능하다는 개념을 기존처럼 단순히 왼쪽이 오른쪽에 포함된다 안될 듯 하다. extends는 여러 사례들을 보면서 좀 더 이해도를 높여야겠다.



#### as const

리터럴 타입에 대한 이해가 바뀌면서 as const에 대한 이해도 바뀌었다

전에는 as const -> 리터럴 타입을 만들어주는 것 -> 리터럴 타입이니까 자연스럽게 readonly타입이 붙는것

이었는데 잘못되었고 그냥 as const는 불변한 리터럴 타입을 만들어주는 것이다.

```ts
const list = [1, 2, 3] as const
list[1] = 4
```



as const는 선언된 값의 타입을 리터럴 타입으로 만들어주는 것이기 때문에 불변해야지 타입 안정성이 보장된다.

이는 타입 안정성을 위해 불변한 리터럴 타입이 필요하고 이를 만들기 위해 as const를 쓰는 것이기 때문

애초에 리터럴 타입이 포인트가 아니라 타입을 불변하게 만들어주는것이 포인트였다.



#### `readonly`타입이지만 배열에 더할 수 있는 이유

불변타입인데 더해서 두가지 타입을 만들 수 있는건 스프레드 연산자는 기존의 참조값을 바꾸는 것이 아니라 복사한 값을 할당하는 것이기 때문이다.

그러면서 mutable값으로 바뀌고 더할 수 있어진다.



## 898 - Include

JavaScript의 `Array.includes` 함수를 타입 시스템에서 구현하세요. 타입은 두 인수를 받고, `true` 또는 `false`를 반환해야 합니다.

예시:

```ts
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```



```ts

type Includes<T extends readonly any[], U> = (T[number] extends U ? true : false) extends true[T['length']]

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Kars'>, true>>,
  Expect<Equal<Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'>, false>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 7>, true>>,
  Expect<Equal<Includes<[1, 2, 3, 5, 6, 7], 4>, false>>,
  Expect<Equal<Includes<[1, 2, 3], 2>, true>>,
  Expect<Equal<Includes<[1, 2, 3], 1>, true>>,
  Expect<Equal<Includes<[{}], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[boolean, 2, 3, 5, 6, 7], false>, false>>,
  Expect<Equal<Includes<[true, 2, 3, 5, 6, 7], boolean>, false>>,
  Expect<Equal<Includes<[false, 2, 3, 5, 6, 7], false>, true>>,
  Expect<Equal<Includes<[{ a: 'A' }], { readonly a: 'A' }>, false>>,
  Expect<Equal<Includes<[{ readonly a: 'A' }], { a: 'A' }>, false>>,
  Expect<Equal<Includes<[1], 1 | 2>, false>>,
  Expect<Equal<Includes<[1 | 2], 1>, false>>,
  Expect<Equal<Includes<[null], undefined>, false>>,
  Expect<Equal<Includes<[undefined], null>, false>>,
]
```



### 문제 분석

T는 타입의 배열이며, 그 타입은 하나로 고정되어있지 않고 여러 타입이 섞여 있다.

그리고 U에 T에 속한 경우 true를 아닌 경우 false를 반환한다



### 첫번째 접근

배열이 들어간 만큼 배열을 유니온 타입으로 바꾸어서 분배 법칙을 사용하는 아이디어까지는 떠올렸다



```ts
type Includes<T extends readonly any[], U> = true extends (T[number] extends U ? true : false) ? true : false

```

그래서 저렇게 비교한 boolean의 유니온 타입에 true가 하나만 있으면 true가 되게 하면 된다

`T[number] extends U ? true : false)`

이거로 하면 유니온 타입중에 U랑 같은게 있으면 true가 포함된 boolean의 유니온 타입이 되고

`true extends {boolean의 유니온 타입}`으로 true가 있다면 true를 반환하도록 해봤다



### 두번째 접근

```ts
type Includes<T extends readonly any[], U> = U extends T[number] ? true : false;
```

그냥 단순히 할당하는 경우는 안될거 같긴했는데 타입이 섞여 있어서 안된다



### 정답

찾아보니 infer와 스프레드 연산자, 재귀를 통해 푸는 방법이 있고

객체화해서 가능 여부로 푸는 방법이 있는데, 두 경우 다 타입을 비교하는 타입을 하나 더 만들어야 한다.

```ts
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends 
                  (<T>() => T extends Y ? 1 : 2) ? true : false;
```

Equal 타입은 이렇게 만들던데 이건 문제 나오면 그때가서 다시 봐야겠다.



객체로 만들어서 푸는 방식이 생각했던 방향성이라 비슷해서 공부했다.

```ts 
type Includes<T extends readonly any[], U> = 
    true extends { [K in keyof T]: MyEqual<T[K], U> }[number] ? true : false;
```

첫번째 방식이랑 비슷한데 첫번째 방식에서 분배 법칙으로 해도 다른값에 할당가능하기때문에 답이 안됐고

Equal을 통해 같은 타입이라는 것을 True로 반환해야 하고 그 이후로는 유니온 타입으로 만들어서 true가 할당되는지(하나라도 true가 있는지 판단한다)



#### keyof 배열, 객체[number]

지금까지 객체에만 keyof를 쓰고 배열에만 [number]를 썼다

keyof는 키값, [number]는 값을 가져오는 것이기 때문이다



근데 반대로도 적용하는 예시는 익숙하지 않았다.

개념 자체는 기본적인 개념이다.

배열의 키값은 인덱스고, 객체의 값은 value값의 유니온 타입이다

`{ [K in keyof T]: {인덱스(k)와 T를 이용할 수 있는 타입연산} }[number]`

 `:` 오른쪽에 있는 타입 연산을 순회해서 T를 돌면서 반환할 수 있는 형태인 것이다.

즉, 가장 흔히 쓰이는 `.map`이나 `for문/range`의 느낌이 나서 자주 쓸 것으로 보인다



## 3057-Push

`Array.push`의 제네릭 버전을 구현하세요.

```ts
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

```ts

type Push<T, U> = any

/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Push<[], 1>, [1]>>,
  Expect<Equal<Push<[1, 2], '3'>, [1, 2, '3']>>,
  Expect<Equal<Push<['1', 2, '3'], boolean>, ['1', 2, '3', boolean]>>,
```

### 문제 분석

T는 배열이고 그 배열에 U를 포함시키는 유틸리티 타입이다



### 풀이

```ts
type Push<T extends unknown[], U> = [...T, U]
```

T는 배열로 extends 해주었고

스프레드 연산자와 U가 포함된 배열을 만들어주었다.



## 3060-Unshift

`Array.unshift`의 타입 버전을 구현하세요.

예시:

```ts
type Result = Unshift<[1, 2], 0> // [0, 1, 2]
```

```ts
type Unshift<T, U> = any
```

### 문제 분석

T는 배열이고 U를 이번에는 앞에 넣어준다.



### 풀이

```ts
type Unshift<T extends unknown[], U> = [U, ...T]
```

T는 배열로 unknown해주고 U와 T를 스프레드 연산자로 복사해준것을 합친 배열을 호출한다.



## 3312- Parameters

내장 제네릭 `Parameters<T>`를 이를 사용하지 않고 구현하세요.

예시:

```ts
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

```ts
type MyParameters<T extends (...args: any[]) => any> = any


/* _____________ 테스트 케이스 _____________ */
import type { Equal, Expect } from '@type-challenges/utils'

function foo(arg1: string, arg2: number): void {}
function bar(arg1: boolean, arg2: { a: 'A' }): void {}
function baz(): void {}

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>,
]

```

### 문제 분석

함수 타입의 파라미터들의 타입을 튜플 타입 형태로 반환하는 유틸리티 타입이다.



### 접근

파라미터에 들어갈 타입을 추론하는 것인만큼 infer가 쓰일거라 생각했다.

하지만 여러개의 파라미터를 동시에 받는것과 그걸 배열로 반환하는 법이 감이 안왔다.



### 풀이

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never 
```

제네릭에 이미 extends로 T의 형태가 한정되어 있어서 오히려 좀 헷갈렸다.

infer를 다시 되새겨 보면 조건문 형식의 extends에서 들어가고 해당 extends가 할당가능할때 infer가 붙은 자리를 추론해서 true문의 위치에 변수로 뱉는다.

제네릭에서 extends는 그 boolean결과를 조건문으로 이어가는 것이 아니라 false일때는 에러를 바로 뱉기 때문에 여기에 infer를 쓰지는 못한다.



#### 파라미터의 타입

타입스크립트에서 파라미터 리스트는 튜플 타입을 가지고 있다.

```ts
type a = (x: number, y: string, z: boolean) => void;
// 파라미터 리스트 타입 [number, string, boolean]
```

그렇기 때문에 파라미터의 타입을 추론하면 타입의 튜플 타입을 반환하는 것이다.
