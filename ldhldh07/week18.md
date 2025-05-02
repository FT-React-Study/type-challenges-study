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