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



##