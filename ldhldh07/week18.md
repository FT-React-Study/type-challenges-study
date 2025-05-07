# week18

## Public Type

Remove the key starting with `_` from given type `T`.

```ts
type cases = [
  Expect<Equal<PublicType<{ a: number }>, { a: number }>>,
  Expect<Equal<PublicType<{ _b: string | bigint }>, {}>>,
  Expect<Equal<PublicType<{ readonly c?: number }>, { readonly c?: number }>>,
  Expect<Equal<PublicType<{ d: string, _e: string }>, { d: string }>>,
  Expect<Equal<PublicType<{ _f: () => bigint[] }>, {}>>,
  Expect<Equal<PublicType<{ g: '_g' }>, { g: '_g' }>>,
  Expect<Equal<PublicType<{ __h: number, i: unknown }>, { i: unknown }>>,
]
```



### 문제분석

타입으로 구성된 객체 중에 앞에 _가 붙은 타입은 제외하고 반환한다.



### 첫번째 접근 - 정답

```ts
type PublicType<T extends object> = 
  {[P in keyof T as P extends `_${string}` ? never : P]: T[P]}
```

as로 키값을 걸러줬다. 기준은 템플릿 리터럴로 문자열이 _로 시작하는 단어로 했다.



## Extract Object

Implement a type that extract prop value to the interface. The type takes the two arguments. The output should be an object with the prop values. Prop value is object.

For example

```ts
type Test = { id: '1', myProp: { foo: '2' }}
type Result = ExtractToObject<Test, 'myProp'> // expected to be { id: '1', foo: '2' }
```

```ts
type test1 = { id: '1', myProp: { foo: '2' } }

type testExpect1 = {
  id: '1'
  foo: '2'
}

type test2 = {
  id: '1'
  prop1: { zoo: '2' }
  prop2: { foo: '4' }
}

type testExpect2 = {
  id: '1'
  prop1: { zoo: '2' }
  foo: '4'
}

type test3 = {
  prop1: { zoo: '2', a: 2, b: 4, c: 7 }
  prop2: { foo: '4', v: 2, d: 4, g: 7 }
  k: 289
}

type testExpect3 = {
  zoo: '2'
  a: 2
  b: 4
  c: 7
  prop2: { foo: '4', v: 2, d: 4, g: 7 }
  k: 289
}

type test4 = { id: '1', myProp: { foo: '2' } }

type testExpect4 = {
  id: '1'
  myProp: { foo: '2' }
}

type cases = [
  Expect<Equal<ExtractToObject<test1, 'myProp'>, testExpect1>>,
  Expect<Equal<ExtractToObject<test2, 'prop2'>, testExpect2>>,
  Expect<Equal<ExtractToObject<test3, 'prop1'>, testExpect3>>,
  // @ts-expect-error
  Expect<Equal<ExtractToObject<test4, 'prop4'>, testExpect4>>,
]
```

### 문제 분석

객체와 객체의 키중 하나의 값을 제네릭으로 받는다. U로 받은 키값의 값은 객체로 그 안의 값들을 추출해서 상위 레벨의 객체에 합친다.



### 첫번째 접근 - 정답

```ts
type ExtractToObject<T, U extends keyof T> = 
  {[P in keyof T as P extends U ? never : P]: T[P]} & T[U] extends infer S ? {[P in keyof S]: S[P]} : never
```

일단 U에 해당하는 객체 속성을 제거한 후, 그 값에 들어있는 객체를 합쳐준다.

`&`와 `extends infer S ? {[P in keyof S]: S[P]}`로 합친다.

그리고 제네릭 U에 T의 키값이라는 제한을 걸어준다



## Deep Omit

Implement a type`DeepOmit`, Like Utility types [Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys), A type takes two arguments.

For example:

```ts
type obj = {
  person: {
    name: string;
    age: {
      value: number
    }
  }
}

type test1 = DeepOmit<obj, 'person'>    // {}
type test2 = DeepOmit<obj, 'person.name'> // { person: { age: { value: number } } }
type test3 = DeepOmit<obj, 'name'> // { person: { name: string; age: { value: number } } }
type test4 = DeepOmit<obj, 'person.age.value'> // { person: { name: string; age: {} } }
```

```ts
type obj = {
  person: {
    name: string
    age: {
      value: number
    }
  }
}

type cases = [
  Expect<Equal<DeepOmit<obj, 'person'>, {}>>,
  Expect<Equal<DeepOmit<obj, 'person.name'>, { person: { age: { value: number } } }>>,
  Expect<Equal<DeepOmit<obj, 'name'>, obj>>,
  Expect<Equal<DeepOmit<obj, 'person.age.value'>, { person: { name: string, age: {} } }>>,
]
```



### 문제 분석

객체에서 제네릭으로 입력된 이름의 키값을 제외한다.

여러 단계의 객체에는 `.`으로 단계별 탐색이 이뤄진다.

### 첫번째 접근 - 정답

```ts
type DeepOmit<T,U> =
  {[P in keyof T as P extends U ? never : P]: 
   	DeepOmit<T[P], U extends `${P extends string ? P : never}.${infer Rest}` ? Rest : never>}
```

`as`를 이용해서 키값이 U인 속성을 제거한다.

그리고 해당 키값에서 더 깊이 탐색하는 경우 - `{해당 키값}.`에는 재귀를 해서 해당 속성을 찾아들어간다.

재귀의 제네릭으로는 그 속성의 값(객체인)과 `.`뒤에 들어가는 문자열로 한다.



## Is Odd

return true is a number is odd

```ts
type cases = [
  Expect<Equal<IsOdd<5>, true>>,
  Expect<Equal<IsOdd<2023>, true>>,
  Expect<Equal<IsOdd<1453>, true>>,
  Expect<Equal<IsOdd<1926>, false>>,
  Expect<Equal<IsOdd<2.3>, false>>,
  Expect<Equal<IsOdd<3e23>, false>>,
  Expect<Equal<IsOdd<3e0>, true>>,
  Expect<Equal<IsOdd<number>, false>>,
]
```

### 문제 분석

숫자를 받아서 음수인 여부를 참/거짓으로 반환한다.



### 첫번째 접근 - 정답

```ts
type LastOfString<T extends string> =
  T extends `${string}${infer Rest}`
    ? Rest extends '' 
      ? T
      : LastOfString<Rest>
    : T;

type IsOdd<T extends number> =
  `${T}` extends `${string}.${string}`
    ? false
    : `${T}` extends `${string}e${infer AfterE}`
      ? AfterE extends '0'
        ? true
        : false
      : LastOfString<`${T}`> extends '1' | '3' | '5' | '7' | '9'
        ? true
        : false
```

기본 골자는 맨 뒤의 숫자를 통해 판단한다.

예외의 경우로 `{N}e{숫자}`형태와 소수점 형태가 있다.

소수점은 어떤 형태든 짝수가 안된다.

`e`는 10의 e승을 곱한다는 의미



### 개선된 답

```ts
type IsOdd<T extends number> =
  `${T}` extends `${string}.${string}`
    ? false
    : `${T}` extends `${string}e${infer AfterE}`
      ? AfterE extends '0'
        ? true
        : false
      : `${T}` extends `${string}${1 | 3 | 5 | 7 | 9}`
          ? true
          : false
```

답을 보고 생각해보니 문자열 마지막이 홀수라는 것을 굳이 마지막을 추출해서 할 필요가 없었다

템플릿 리터럴로 답을 줄일 수 있었다



```ts
type IsOdd<T extends number> =
  `${T}` extends `${string}.${string}` | `${string}e+${string}`
    ? false
    : `${T}` extends `${string}${1 | 3 | 5 | 7 | 9}`
      ? true
      : false
```

또한 E의 뒤의 값이 0이 되는걸 따로 구분하지 않아도 됐다.



#### 지수표기로 된 숫자의 문자열 변환

e notation은 자바스크립트에서 숫자로 변환을 해주는데

```ts
type case6 = `${3e23}` // '3e+23'
type case7 = `${3e0}` // '3'
type case = `${3.1221e2}` // `312.21`

```

이런식으로 지수 계산이 이루어지고 문자열로 변환을 한다.

그리고 그 수가 너무 클 경우 `3e+23` 이런식의 지수 표기법을 그대로 문자로 반환한다.

그렇기 때문에 `e+`가 들어간 상태면 무조건 false로 해주면 된다. 끝이 0으로 끝나기 때문

그리고 아닌 경우는 숫자로 변환된 상태이기 때문에 기존의 로직에 포함시키면 된다.



## Tower of hanoi

Simulate the solution for the Tower of Hanoi puzzle. Your type should take the number of rings as input an return an array of steps to move the rings from tower A to tower B using tower C as additional. Each entry in the array should be a pair of strings `[From, To]` which denotes ring being moved `From -> To`.



```ts
type Tests = [
  Expect<Equal<Hanoi<0>, []>>,
  Expect<Equal<Hanoi<1>, [['A', 'B']]>>,
  Expect<Equal<Hanoi<2>, [['A', 'C'], ['A', 'B'], ['C', 'B']]>>,
  Expect<Equal<Hanoi<3>, [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B'], ['C', 'A'], ['C', 'B'], ['A', 'B']]>>,
  Expect<Equal<Hanoi<5>, [['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B'], ['C', 'A'], ['C', 'B'], ['A', 'B'], ['A', 'C'], ['B', 'C'], ['B', 'A'], ['C', 'A'], ['B', 'C'], ['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B'], ['C', 'A'], ['C', 'B'], ['A', 'B'], ['C', 'A'], ['B', 'C'], ['B', 'A'], ['C', 'A'], ['C', 'B'], ['A', 'B'], ['A', 'C'], ['B', 'C'], ['A', 'B'], ['C', 'A'], ['C', 'B'], ['A', 'B']]>>,
]
```



### 문제 해석

하노이의 탑을 타입으로 구현한다. N은 현재 A에 껴져 있는 링의 갯수이다.

그리고 각 기둥에서 맨위의 링을 옮기는 것을 각 탑 이름의 Pair 배열 타입으로 반환한다.



### 정답

```ts
type Hanoi<
  N extends number,
  From = "A",
  To = "B",
  Intermediate = "C",
  IndexArray extends Array<any> = []
> = IndexArray["length"] extends N
  ? []
  : [
      ...Hanoi<N, From, Intermediate, To, [...IndexArray, any]>,
      [From, To],
      ...Hanoi<N, Intermediate, To, From, [...IndexArray, any]>
    ]
```



먼저 답을 찾아봤다.

로직은 intermediate 기둥에 하나를 빼고 다 옮긴다.

하나만 b로 옮긴다.

intermediate에 있는 원판들을 다 b로 옮긴다.

였고 그걸 구현한 답이었다.

