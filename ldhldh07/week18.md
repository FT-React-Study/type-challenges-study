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