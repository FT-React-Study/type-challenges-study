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



#### extends infer O ? { [P in keyof O]: O[P] } : never;

객체를 인터섹션(&)으로 합친 경우 타입스크립트는 인터섹션을 그대로 유지한 채로 타입을 평가한다.

그렇기 때문에 합쳐진 형태의 객체로 다시 만들기 위해서 이와 같은 작업을 해준다.



infer O로 저장할 객체를 할당해준 다음에 이 O를 순회하여 합쳐진 형태의 객체를 만든다.



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
