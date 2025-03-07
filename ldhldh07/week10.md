# week10

## Tuple to Nested Object

Given a tuple type `T` that only contains string type, and a type `U`, build an object recursively.

```ts
type a = TupleToNestedObject<['a'], string> // {a: string}
type b = TupleToNestedObject<['a', 'b'], number> // {a: {b: number}}
type c = TupleToNestedObject<[], boolean> // boolean. if the tuple is empty, just return the U type
```

```ts
type cases = [
  Expect<Equal<TupleToNestedObject<['a'], string>, { a: string }>>,
  Expect<Equal<TupleToNestedObject<['a', 'b'], number>, { a: { b: number } }>>,
  Expect<Equal<TupleToNestedObject<['a', 'b', 'c'], boolean>, { a: { b: { c: boolean } } }>>,
  Expect<Equal<TupleToNestedObject<[], boolean>, boolean>>,
]

```

### 문제 분석

튜플에 있는 원소들을 단계별로 nested하게 객체로 넣고 마지막 원소의 값으로 두번째 제네릭의 값을 넣어준다.



### 첫번째 접근

```ts
type TupleToNestedObject<T, U> = 
  T extends [infer First, ...infer Rest]
    ? { First: TupleToNestedObject<Rest, U> }
    : U;
```

배열을 infer로 하나씩 빼서 객체의 키로 만들고 extends가 안될 때 , 즉 원소가 하나만 남았을때는 U를 반환하도록 해봤다.

하지만 4번째 케이스 말고는 안됐고

특히 First가 린트에 의해 사용되지 않았다 표시된 것을 보니 key로 First라는 문자열을 그대로 넣는 것은 적용이 안되는 듯 했다.



그냥 First라는 키가 들어간 것으로 평가가 되었다



### 두번째 접근 - 정답

```ts
type TupleToNestedObject<T, U> = 
  T extends [infer First, ...infer Rest]
    ? { [K in First as First extends PropertyKey ? First : never] : TupleToNestedObject<Rest, U> }
    : U;
```

지금까지 유니온들만 써서 놓쳤지만 mapped type에서 [K in {PropertyKey 타입}]은 string, number, symbol을 키로 바꿔줬다

하나의 타입이여도 마찬가지였다.

또한 이때 First는 PropertyKey타입이어야 했고 이는 as로 제한해줬다.



## Reverse

Implement the type version of `Array.reverse`

For example:

```ts
type a = Reverse<['a', 'b']> // ['b', 'a']
type b = Reverse<['a', 'b', 'c']> // ['c', 'b', 'a']
```

```ts
type cases = [
  Expect<Equal<Reverse<[]>, []>>,
  Expect<Equal<Reverse<['a', 'b']>, ['b', 'a']>>,
  Expect<Equal<Reverse<['a', 'b', 'c']>, ['c', 'b', 'a']>>,
]

type errors = [
  // @ts-expect-error
  Reverse<'string'>,
  // @ts-expect-error
  Reverse<{ key: 'value' }>,
]
```



### 문제 분석

배열 타입에서 원소들의 순서를 거꾸로 한다.



### 첫번째 접근 - 정답

```ts
type Reverse<T extends Array<any>> =
  T extends [infer First, ...infer Rest]
    ? [...Reverse<Rest>, First]
    : T
```

하나씩 바꿔주는 방식으로 했다.



### 다른 정답

```ts
type Reverse<T extends any[]> =
  T extends [infer First, ...infer Middle, infer Last]
    ? [Last, ...Reverse<Middle>, First]
    : T
```

이런식으로도 되지 않을까 해서 해봤는데 됐다.



## Flip Arguments

Implement the type version of lodash's `_.flip`.

Type `FlipArguments<T>` requires function type `T` and returns a new function type which has the same return type of T but reversed parameters.

For example:

```ts
type Flipped = FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void> 
// (arg0: boolean, arg1: number, arg2: string) => void
```

```ts
type cases = [
  Expect<Equal<FlipArguments<() => boolean>, () => boolean>>,
  Expect<Equal<FlipArguments<(foo: string) => number>, (foo: string) => number>>,
  Expect<Equal<FlipArguments<(arg0: string, arg1: number, arg2: boolean) => void>, (arg0: boolean, arg1: number, arg2: string) => void>>,
]

type errors = [
  // @ts-expect-error
  FlipArguments<'string'>,
  // @ts-expect-error
  FlipArguments<{ key: 'value' }>,
  // @ts-expect-error
  FlipArguments<['apple', 'banana', 100, { a: 1 }]>,
  // @ts-expect-error
  FlipArguments<null | undefined>,
]
```



### 문제 분석

함수 타입의 제네릭을 받아 args의 순서를 거꾸로 해서 반환하도록 하는 유틸리티 함수이다.



### 첫번째 접근 - 정답

```ts
type Reverse<T extends any[]> =
  T extends [infer First, ...infer Middle, infer Last]
    ? [Last, ...Reverse<Middle>, First]
    : T
    
type FlipArguments<T extends (...args: any) => any> =
  T extends (...args: infer ParameterTypes) => infer ReturnType
   ? (...args: Reverse<ParameterTypes>) => ReturnType
   : never
```

파라미터 타입과 리턴 타입을 infer로 받아 파라미터 타입에 직전에 했던 Reverse를 적용해줬다



## FlattenDepth

Recursively flatten array up to depth times.

For example:

```ts
type a = FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2> // [1, 2, 3, 4, [5]]. flattern 2 times
type b = FlattenDepth<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, [[5]]]. Depth defaults to be 1
```



If the depth is provided, it's guaranteed to be positive integer.



```ts
type cases = [
  Expect<Equal<FlattenDepth<[]>, []>>,
  Expect<Equal<FlattenDepth<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<FlattenDepth<[1, [2]]>, [1, 2]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]], 2>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, [[5]]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 3>, [1, 2, 3, 4, [5]]>>,
  Expect<Equal<FlattenDepth<[1, [2, [3, [4, [5]]]]], 19260817>, [1, 2, 3, 4, 5]>>,
]
```



### 문제 분석

여러개의 뎁스에 있는 값들을 다 depth1로 변환해서 배열로 반환한다.



### 첫번째 접근

```ts
type FlattenDepth<T> = 
  T extends [infer First, ...infer Rest] 
    ? First extends Array<any>
      ? [...FlattenDepth<First>, ...FlattenDepth<Rest>]
      : [First, ...FlattenDepth<Rest>]
    : T
```

배열인 경우에는 먼저 배열이 하나짜리인지 판단후, 재귀적으로 뎁스를 없에주고 depth가 1일때는 뒷 부분을 진행해주는 방식을 이용했다.

하지만 이 유틸리티 함수의 제네릭은 두개였고 뎁스를 줄여주는 횟수를 만들어주는 제네릭도 하나 있었다.



### 두번째 접근

```ts
type FlattenDepth<T, Limit = 1, CountArray extends Array<any> = []> = 
  CountArray['length'] extends Limit
    ? T
    : T extends [infer First, ...infer Rest] 
      ? First extends Array<any>
        ? [...FlattenDepth<First, Limit, ['박대연', ...CountArray]>, ...FlattenDepth<Rest, Limit, CountArray>]
        : [First, ...FlattenDepth<Rest, Limit, CountArray>]
      : T
```



숫자 값을 이용할 때 ['length']와 가상의 배열값을 통해 해결하는 방식이 이전에도 관념으론 나왔었던 것 같고, gpt로 힌트를 얻어서 적용했다.

가상의 배열을 만들고 뎁스를 하나 줄일때마다 원소를 하나씩 늘려준다 그게 Limit으로 들어온 값과 length가 같아지면 반환한다.



빈 배열을 통해 counting을 하는 방식은 계속 유용하게 사용할 수 있을 듯 하다.



## BEM style string

The Block, Element, Modifier methodology (BEM) is a popular naming convention for classes in CSS.

For example, the block component would be represented as `btn`, element that depends upon the block would be represented as `btn__price`, modifier that changes the style of the block would be represented as `btn--big` or `btn__price--warning`.

Implement `BEM<B, E, M>` which generate string union from these three parameters. Where `B` is a string literal, `E` and `M` are string arrays (can be empty).

```ts
type cases = [
  Expect<Equal<BEM<'btn', ['price'], []>, 'btn__price'>>,
  Expect<Equal<BEM<'btn', ['price'], ['warning', 'success']>, 'btn__price--warning' | 'btn__price--success' >>,
  Expect<Equal<BEM<'btn', [], ['small', 'medium', 'large']>, 'btn--small' | 'btn--medium' | 'btn--large' >>,
]
```



### 문제 접근

BEM의 적용법을 그대로 사용해서 계층별로 문자열로 반환한다



### 첫번째 접근 - 정답

```ts
type BEM<B extends string, E extends string[], M extends string[]> = 
  E extends []
    ? M extends []
      ? `${B}`
      : any extends M[number]
        ? `${B}--${M[number]}`
        : never
    : any extends E[number]
      ? M extends []
        ? `${B}__${E[number]}`
        : any extends M[number]
          ? `${B}__${E[number]}--${M[number]}`
          : never
      : never
```

[number]를 통해 유니온으로 만들어준 후 분배법칙을 사용하는걸 기본 방식으로 경우의 수를 나눠서 풀었다



### 더 나은 정답

```ts
type BEM<B extends string, E extends string[], M extends string[]> = 
  E[number] extends never
    ? M[number] extends never
      ? B
      : `${B}--${M[number]}`
    : M[number] extends never
      ? `${B}__${E[number]}`
      : `${B}__${E[number]}--${M[number]}`;
```

분배법칙을 extends 앞에서도 적용된다는 것을 까먹었다

이 방식대로면 분배법칙을 사용하면서 E가 공집합인지도 동시에 평가가 가능하다.



## Flip

Implement the type of `just-flip-object`. Examples:

```
Flip<{ a: "x", b: "y", c: "z" }>; // {x: 'a', y: 'b', z: 'c'}
Flip<{ a: 1, b: 2, c: 3 }>; // {1: 'a', 2: 'b', 3: 'c'}
Flip<{ a: false, b: true }>; // {false: 'a', true: 'b'}
```



No need to support nested objects and values which cannot be object keys such as arrays

```ts
type cases = [
  Expect<Equal<{ a: 'pi' }, Flip<{ pi: 'a' }>>>,
  Expect<NotEqual<{ b: 'pi' }, Flip<{ pi: 'a' }>>>,
  Expect<Equal<{ 3.14: 'pi', true: 'bool' }, Flip<{ pi: 3.14, bool: true }>>>,
  Expect<Equal<{ val2: 'prop2', val: 'prop' }, Flip<{ prop: 'val', prop2: 'val2' }>>>,
]
```



### 문제분석

객체 속성에서 key와 value값을 뒤집어준다



### 첫번째 접근

```ts
type Flip<T> = {
  [P in keyof T as T[P] extends PropertyKey ? T[P] : never] : P
}
```

key는 as를 통해 value의 값으로 만들어주고 value에는 P를 그대로 넣었다



이 경우 세번째 케이스에서 오류가 났다.

boolean은 PropertyKey로 원래 될 수 없는 값인데 이 케이스에는 일종의 string으로 자동변환되어서 적용되는 느낌으로 키값으로 들어간다.



### 두번째 접근 - 정답

```ts
type Flip<T> = {
  [P in keyof T as 
    T[P] extends boolean | null | undefined 
      ? `${T[P]}`
      : T[P] extends PropertyKey
        ? T[P]
        : never
  ]: P
}
```

string으로 바꿀 수 있는 boolean | null | undefined의 경우 템플릿 리터럴로 string으로 바꿔서 넣었다