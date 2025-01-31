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



## 62 Type Lookup

때때로 유니온 타입의 특정 속성을 기준으로 조회할 수도 있습니다.

이 챌린지에서는 유니온 타입 `Cat | Dog`에서 공통으로 사용하는 `type` 필드를 기준으로 해당하는 타입을 얻고자 합니다. 다시 말해서, 다음 예시에서는 `LookUp<Cat | Dog, 'dog'>`으로 `Dog` 타입을, `LookUp<Cat | Dog, 'cat'>`으로 `Cat` 타입을 얻을 수 있습니다.

```ts
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDogType = LookUp<Cat | Dog, 'dog'> // 기대되는 결과는 `Dog`입니다.
```

```ts
import type { Equal, Expect } from '@type-challenges/utils'

interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type Animal = Cat | Dog

type cases = [
  Expect<Equal<LookUp<Animal, 'dog'>, Dog>>,
  Expect<Equal<LookUp<Animal, 'cat'>, Cat>>,
]
```





### 문제 분석

`type`이라는 속성이 존재하는 타입들의 유니온 타입이 제네릭의 첫번째로 들어가고 두번째로 그 타입에 들어가는 value가 들어간다

이때 두번째 제네릭에 있는 값을 'type' 속성의 value값으로 가지고 있는 interface 타입을 반환하는 유틸리티 타입이다



### 첫번째 접근

```ts
type MyLookUp<U extends {type: any}, T> = U['type'] extends T ? U : never;
```

먼제 U가 type이라는 속성을 가지고 있는 타입이라는걸 분배 법칙으로 한정해줬다

그리고 그 value가 T일때 그 U를 반환하도록 했다



### 두번째 접근 - 정답

```ts
type MyLookUp<U extends {type: any}, T> = U extends {type: T} ? U : never;
```

`U['type'] extends T`가 아니라 `U extends {type: T}`를 이용했다



U['type']은 분배 타입에 따라 `'cat' | 'dog'`로 평가가 됨

유니온 타입을 평가하는 시점이 ['type']를 탐색하는 때가 아니라 먼저 분배를 하고 type이 T인지 확인해야 한다 



### 타입 패턴 매칭

해당 문제는 이 문제의 로직을 작성하는 것보다는 이 동작 자체에 대해서 좀 관심이 갔다.

이 동작은 특정 'type'속성을 가지고 있는 지 평가하는 동작이다.

타입스크립트 언어에서 타입 평가를 할때 어떤 타입인지 평가를 할 텐데 그걸 기본적인 형태로 보여준 것이라고 느꼈다.

패턴 매칭 - 특정 구조(패턴)을 가진 데이터를 식별하고 매칭하는 방식



해당 Lookup도 타입이 일치하는, 패턴이 일치하는 경우 그걸 반환한다.

이런 패턴 매칭을 이용해 선언적으로 작성한 문법이다.

실제로 타입스크립트 런타입 코드 레벨에서 패턴 매칭을 해주는 라이브러리인 ts-pattern이 이거랑 비슷한 형태로 구현되어있음

## 106 - Trim Left

정확한 문자열 타입이고 시작 부분의 공백이 제거된 새 문자열을 반환하는 `TrimLeft<T>`를 구현하십시오.

예시

```ts
type trimed = TrimLeft<'  Hello World  '> // 기대되는 결과는 'Hello World  '입니다.
```

```ts
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<TrimLeft<'str'>, 'str'>>,
  Expect<Equal<TrimLeft<' str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str     '>, 'str     '>>,
  Expect<Equal<TrimLeft<'   \n\t foo bar '>, 'foo bar '>>,
  Expect<Equal<TrimLeft<''>, ''>>,
  Expect<Equal<TrimLeft<' \n\t'>, ''>>,
]
```



### 문제분석

문자열 타입을 반환해야 한다는 점이 생소했다.



### 첫번째 접근

```ts
type TrimLeft<S extends string> = {[U in S as U extends string ? U : never ]: U }
```



문자열을 배열로 바꾼 후에 스프레드 연산자와 infer를 이용한 방식을 생각했었다

하지만 타입스크립트는 문자열을 그냥 순회돌릴수 있는 시스템이 아니었다

그리고 배열로 바꾸더라도 그걸 다시 문자열로 바꿀 수 있는 방법이 떠오르지 않았다

### 타입스크립트에서의 템플릿 리터럴

템플릿 리터럴 : 백틱 과 템플릿 플레이스홀더`${}`를 이용해서 문자열에 변수를 포함해서 동적으로 정의할 수 있는 문법

타입스크립트는 infer를 이용해서 이 기능을 강력하게 사용할 수 있다

[공식문서](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html?utm_source=chatgpt.com)

### 정답

```ts
type TrimLeft<S extends string> = 
  S extends `${' ' | '\t' | '\n'}${infer Rest}` ? TrimLeft<Rest> : S;
```

S에 trim해야할 문자열들과 infer변수로 조합된 문자열을 할당한다.

이때 trim해야할 문자열이 있는 경우 true로 판단하여 재귀적으로 이 과정을 반복한다.



그 반복이 지속되지 않는 경우 - trim해야할 문자열이 앞부분에 없는 경우 - 반복이 종료된다



#### 템플릿 리터럴과 infer

동작에 의문이 들었던 것이 부분 - 템플릿 리터럴을 통해 하나의 문자와 나머지 문자열로 나눴을 때 그 '한글자' + '나머지 문자열'의 패턴을 S에도 패턴매칭이 이뤄져서 한글자 + 나머지 글자로 평가해주는 것이다.

```ts
type ExtractFirstChar<S extends string> = S extends `${First}${infer Rest}` ? First : never;
```

이는 **“문자열의 첫 번째 문자를 추출하는 로직을 선언적으로 작성”** 한 것이다

문자열을 배열로 나눠서 분리하고, 거기서 첫글자를 분리해서 그 글자를 평가하고 다시 그 첫글자를 반환 -> 이런 어떻게'를 작성하는 것이 명령형

템플릿 리터럴과 extends를 통해 특정 구조를 패턴 매칭 시킨 형태로 선언하는 것이 선언형



여기서 S도 `${First}${infer Rest}`와 같이 데이터 구조로 선언되고

어떤 데이터 구조를 만들고 그걸 extends로 평가할때 그 데이터 구조로 자동으로 매칭을 해서 s의 패턴을 평가하는 패턴매칭이 동작한다는 개념에 익숙해져야 한다.



그렇기 때문에 infer도 평가가 이뤄진 후 해당 패턴으로 나눠진 뒷 부분의 값에 할당이 될 수 있다



이게 선언형 프로그래밍 -> 타입스크립트의 타입 시스템이 선언형의 특성이 강하고 패턴매칭이 되기 때문에 이런식이 가능하다.

의문이 든 것 자체가 그런 동작이 명령적으로 수행되었어야 한다는 명령적 프로그래밍에 익숙한 사고였고, 그 동작이 어떻게 수행되고 값들이 어떻게 제어되는지 명령형으로 되어있지 않는것에 익숙하지 않아서 그런것이다.



이건 그 원리보다도 타입스크립트는 그렇게 동작하는 언어라는 것을 인식하고 이런 형식의 문법을 눈에 익히고 사고하는 것에 초점을 뒀다.



## 108 - Trim



정확한 문자열 타입이고 양쪽 끝의 공백이 제거된 새 문자열을 반환하는 `Trim<T>`를 구현하십시오.

예시

```ts
type trimmed = Trim<'  Hello World  '> // 기대되는 결과는 'Hello World'입니다.
```

```ts
import type { Equal, Expect } from '@type-challenges/utils'

type cases = [
  Expect<Equal<Trim<'str'>, 'str'>>,
  Expect<Equal<Trim<' str'>, 'str'>>,
  Expect<Equal<Trim<'     str'>, 'str'>>,
  Expect<Equal<Trim<'str   '>, 'str'>>,
  Expect<Equal<Trim<'     str     '>, 'str'>>,
  Expect<Equal<Trim<'   \n\t foo bar \t'>, 'foo bar'>>,
  Expect<Equal<Trim<''>, ''>>,
  Expect<Equal<Trim<' \n\t '>, ''>>,
]
```

### 문제분석

양쪽의 공백, \n, \t를 제거

### 첫번째 접근 - 정답

```ts
type Trim<S extends string> = S extends `${' '|'\n'|`\t`}${infer Rest}` ? Trim<Rest> :  S extends `${infer Rest}${' '|'\n'|`\t`}` ? Trim<Rest> : S
```

trim left 로직과 trim right로직을 순차적으로 실행해준다.



