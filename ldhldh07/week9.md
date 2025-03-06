# week 9

## PartialByKeys

두 개의 타입 인수 `T`와 `K`를 사용하는 `PartialByKeys<T, K>`를 구성하세요.

`K`는 옵셔널하며 `T`의 프로퍼티로 이루어진 유니언 타입을 지정할 수 있습니다. `K`를 제공하지 않는다면 `Partial<T>`와 같이 모든 프로퍼티를 옵셔널하게 만들어야 합니다.

예시

```ts
interface User {
  name: string
  age: number
  address: string
}

type UserPartialName = PartialByKeys<User, 'name'> // { name?:string; age:number; address:string }
```

```ts
interface User {
  name: string
  age: number
  address: string
}

interface UserPartialName {
  name?: string
  age: number
  address: string
}

interface UserPartialNameAndAge {
  name?: string
  age?: number
  address: string
}

type cases = [
  Expect<Equal<PartialByKeys<User, 'name'>, UserPartialName>>,
  Expect<Equal<PartialByKeys<User, 'name' | 'age'>, UserPartialNameAndAge>>,
  Expect<Equal<PartialByKeys<User>, Partial<User>>>,
  // @ts-expect-error
  Expect<Equal<PartialByKeys<User, 'name' | 'unknown'>, UserPartialName>>,
]

```

### 문제분석

속성이 K의 유니온 타입에 포함될 경우 해당 객체의 속성은 optional하게 바꿔서 다시 반환한다.



### 첫번째 접근

```ts
type PartialByKeys<T, K> = {
  [P in keyof T as P extends K ? P : P?]: T[P]
}
```

그냥 ?를 붙여봤는데 안됐다.

### 정답

```ts
type PartialByKeys<T, K extends keyof T = keyof T> = {
  [P in keyof T as P extends K ? P : never]?: T[P];
} & {
  [P in keyof T as P extends K ? never : P]: T[P];
} extends infer O ? { [P in keyof O]: O[P] } : never;
```

`[]`뒤에 ?를 붙일 경우 optional로 설정이 됐다.



#### 인터섹션 합치기

```ts
T extends infer O ? { [P in keyof O]: O[P] } : never;
```



객체를 인터섹션(&)으로 합친 경우 타입스크립트는 인터섹션을 그대로 유지한 채로 타입을 평가한다.

그렇기 때문에 합쳐진 형태의 객체로 다시 만들기 위해서 이와 같은 작업을 해준다.



infer O로 저장할 객체를 할당해준 다음에 이 O를 순회하여 합쳐진 형태의 객체를 만든다.



공식적으로는 이렇게도 한다

```ts
export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T
```





#### K의 기본값

```ts
  Expect<Equal<PartialByKeys<User>, Partial<User>>>,
  // @ts-expect-error
  Expect<Equal<PartialByKeys<User, 'name' | 'unknown'>, UserPartialName>>,
```

해당 케이스를 처리하기 위해 k의 기본값을 keyof T로 정해줘야 했다



## RequiredByKeys

Implement a generic `RequiredByKeys<T,  K>` which takes two type argument `T` and `K`.

`K` specify the set of properties of `T` that should set to be required. When `K` is not provided, it should make all properties required just like the normal `Required<T>`.

For example

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

type UserRequiredName = RequiredByKeys<User, 'name'> // { name: string; age?: number; address?: string }
```

```ts
interface User {
  name?: string
  age?: number
  address?: string
}

interface UserRequiredName {
  name: string
  age?: number
  address?: string
}

interface UserRequiredNameAndAge {
  name: string
  age: number
  address?: string
}

type cases = [
  Expect<Equal<RequiredByKeys<User, 'name'>, UserRequiredName>>,
  Expect<Equal<RequiredByKeys<User, 'name' | 'age'>, UserRequiredNameAndAge>>,
  Expect<Equal<RequiredByKeys<User>, Required<User>>>,
  // @ts-expect-error
  Expect<Equal<RequiredByKeys<User, 'name' | 'unknown'>, UserRequiredName>>,
]
```

### 문제 분석

Partial By Key와 반대로 U에 들어있는 속성을 required로 만들어야 한다.



### 첫번째 접근

```ts
type RequiredByKeys<T, K extends keyof T = keyof T> = { 
  [P in keyof T as P extends K ? P : never] : T[P]
} & {
  [P in keyof T as P extends K ? never : P] : T[P]
} extends infer O ? { [P in keyof O] : O[P]} : never;
```

그냥 ?가 안붙은 상태로 넣으면 될까 했는데 안됐다



### 정답

```ts
type RequiredByKeys<T, K extends keyof T = keyof T> = { 
  [P in keyof T as P extends K ? P : never]-? : T[P]
} & {
  [P in keyof T as P extends K ? never : P] : T[P]
} extends infer O ? { [P in keyof O] : O[P]} : never;
```



#### -?

?를 제거해서 required로 바꿔주는 속성이다



## mutable

Implement the generic `Mutable<T>` which makes all properties in `T` mutable (not readonly).

For example

```ts
interface Todo {
  readonly title: string
  readonly description: string
  readonly completed: boolean
}

type MutableTodo = Mutable<Todo> // { title: string; description: string; completed: boolean; }
```

```ts
interface Todo1 {
  title: string
  description: string
  completed: boolean
  meta: {
    author: string
  }
}

type List = [1, 2, 3]

type cases = [
  Expect<Equal<Mutable<Readonly<Todo1>>, Todo1>>,
  Expect<Equal<Mutable<Readonly<List>>, List>>,
]

type errors = [
  // @ts-expect-error
  Mutable<'string'>,
  // @ts-expect-error
  Mutable<0>,
]
```

### 문제분석

타입을 mutable 타입으로 바꾼다

readonly로 바꿨던거를 다시 mutable한 타입으로 바꾸는 케이스가 있다

### 첫번째 접근

```ts
type Mutable<T> = {
  [P in keyof T]-readonly: T[P]
}
```

-?도 되길래 -readonly 해봤는데 안됐다



### 두번째 접근

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}
```

앞에다 붙여야 하는 것이었다.



### 세번째 접근

```ts
type Mutable<T extends object> = {
  -readonly [P in keyof T]: T[P]
}
```

에러 케이스들을 위해 T를 제한 걸어줬다.



### OmitByType

From `T`, pick a set of properties whose type are not assignable to `U`.

For Example

```ts
type OmitBoolean = OmitByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { name: string; count: number }
```

```ts
interface Model {
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}

type cases = [
  Expect<Equal<OmitByType<Model, boolean>, { name: string, count: number }>>,
  Expect<Equal<OmitByType<Model, string>, { count: number, isReadonly: boolean, isEnable: boolean }>>,
  Expect<Equal<OmitByType<Model, number>, { name: string, isReadonly: boolean, isEnable: boolean }>>,
]
```

### 문제 분석

객체 타입 T에서 그 타입값이 U인 경우 뺀다.

### 첫번째 접근 - 정답

```ts
type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P] : T[P]
}
```

기본적인 as 방식으로 풀었다.



## ObjectEntries

Implement the type version of `Object.entries`

For example

```ts
interface Model {
  name: string;
  age: number;
  locations: string[] | null;
}
type modelEntries = ObjectEntries<Model> // ['name', string] | ['age', number] | ['locations', string[] | null];
```

```ts
interface Model {
  name: string
  age: number
  locations: string[] | null
}

type ModelEntries = ['name', string] | ['age', number] | ['locations', string[] | null]

type cases = [
  Expect<Equal<ObjectEntries<Model>, ModelEntries>>,
  Expect<Equal<ObjectEntries<Partial<Model>>, ModelEntries>>,
  Expect<Equal<ObjectEntries<{ key?: undefined }>, ['key', undefined]>>,
  Expect<Equal<ObjectEntries<{ key: undefined }>, ['key', undefined]>>,
  Expect<Equal<ObjectEntries<{ key: string | undefined }>, ['key', string | undefined]>>,
]

```

### 문제분석

객체 속성으로 되어있는 값을 개별 속성들의 유니온 값으로 바꿔준다.

### 첫번째 접근

```ts
type ObjectEntries<T, U = keyof T> = 
  U extends keyof T 
    ? [U, T[U]] 
    : never
```

keyof T를 변수로 하나 만든 다음에 keyof T를 가지고 유니온 분배 법칙을 했다

```ts
Expect<Equal<ObjectEntries<Partial<Model>>, ModelEntries>>,
type Case2 = ObjectEntries<Partial<Model>>
// ["name", string | undefined] | ["age", number | undefined] | ["locations", string[] | null | undefined]
```

해당 케이스가 적용이 안됐다 타입이 optional이여서 undefined가 붙는다.

재밌는건 ?로 optional한건 undefined를 제거해야 하고 명시적으로 undefined가 유니온으로 더해진 타입은 붙여야 했다.

속성에 optional하게 만드는 patial을 붙여서 속성이 optional 해진 경우 undefined가 들어가기 때문이다



### 두번째 접근

```ts
type ObjectEntries<T extends object, RequiredT = {[P in keyof T]-?: T[P]}, U = keyof T> = 
  U extends keyof RequiredT 
    ? [U, RequiredT[U]] 
    : never
```

그래서 ?를 다 뺐더니 이번에는

```ts
type Case3 = ObjectEntries<{ key?: undefined }> // ['key', never]
```

이 케이스가 안됐다

`-?`는 아예 빼는 식으로 작동하여 undefined가 never가 되어버린다.



### 세번째 접근 - 정답

```ts
type ObjectEntries<T extends object, RequiredT = {[P in keyof T]-?: T[P]}, U = keyof RequiredT> = 
  U extends keyof RequiredT
    ? RequiredT[U] extends never
      ? U extends keyof T
        ? [U, T[U]]
        : never
      : [U, RequiredT[U]]
    : never
```

이 경우 T의 해당값이 never가 아닌데 Required를 단 후에는 RequiredT[U]는 never가 되어버린 경우를 `[ key? : undefined]`인 경우로 생각했다

그리고 그 경우 undefined로 반환하게 설계를 했다.





#### strictNullChecks

[공식문서](https://www.typescriptlang.org/ko/tsconfig/#strictNullChecks)

이후 undefined 타입을 required로 했을때 왜 never로 되는지 궁금해서 알아보니  이건 타입스크립트 설정과도 관련이 있었다

strictNullChecks 옵션이 true로 되어있는 경우 타입이 required일때 null 혹은 undefined을 허용하지 않는다.

그래서 never로 평가해서 해당 key를 호출할 경우 에러를 일으킨다.



그래서 required로 `-?`가 동작할때 체크를 하고 key의 타입이 `-?`로 required가 됐는데 값은 undefined이니 never가 된다. 	

그리고 이 프로젝트의 경우 strict 설정이 true로 되어있어서 에러가 난다



실제로 이 설정을 false로 하니 두번째 접근의 답도 에러가 나지 않았다.

```ts
type Test = Required<{ key?: undefined }>;
// strictNullChecks가 false인 경우 { key: undefined }
// strictNullChecks가 true 경우 { key: never }
```



## Shift

Implement the type version of `Array.shift`

For example

```ts
type Result = Shift<[3, 2, 1]> // [2, 1]
```

```ts
type cases = [
  // @ts-expect-error
  Shift<unknown>,
  Expect<Equal<Shift<[]>, []>>,
  Expect<Equal<Shift<[1]>, []>>,
  Expect<Equal<Shift<[3, 2, 1]>, [2, 1]>>,
  Expect<Equal<Shift<['a', 'b', 'c', 'd']>, ['b', 'c', 'd']>>,
]
```

### 문제 분석

배열 타입 T에서 가장 앞의 값을 빼서 반환한다.



### 첫번째 접근 - 정답

```ts
type Shift<T extends Array<any>> = T extends [infer _First, ...infer Rest] ? Rest : []
```

infer로 가장 앞의 값을 분리하고 Rest를 반환했다.

extends가 안되는 경우는 빈 배열이기 때문에 빈 배열을 반환한다.
