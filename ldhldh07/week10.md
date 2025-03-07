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

