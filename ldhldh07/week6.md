# week6

## Flatten

주어진 배열을 플랫한 배열 타입으로 바꾸는 Flatten 타입을 구현하세요.

예시:

```ts
type flatten = Flatten<[1, 2, [3, 4], [[[5]]]]> // [1, 2, 3, 4, 5]
```

```ts
type cases = [
  Expect<Equal<Flatten<[]>, []>>,
  Expect<Equal<Flatten<[1, 2, 3, 4]>, [1, 2, 3, 4]>>,
  Expect<Equal<Flatten<[1, [2]]>, [1, 2]>>,
  Expect<Equal<Flatten<[1, 2, [3, 4], [[[5]]]]>, [1, 2, 3, 4, 5]>>,
  Expect<Equal<Flatten<[{ foo: 'bar', 2: 10 }, 'foobar']>, [{ foo: 'bar', 2: 10 }, 'foobar']>>,
]
```



### 문제 분석

배열안에 배열이 있을 경우 해당 배열의 원소를 다 풀어서 1차 배열로 정리한다.



### 첫번째 접근

재귀를 사용해야 한다 생각했고 infer 재귀로 요소를 하나씩 체크하면서 그 요소가 배열일 경우 Flatten을 재귀로 걸고자 했다

```ts
type Flatten<T> = T extends [infer First, ...infer Rest] ? [First extends Array<any> ? Flatten<First>: First, ...Flatten<Rest>] : []
```



### 두번째 접근 - 정답

```ts
type Flatten<T extends Array<any>> = T extends [infer First, ...infer Rest] 
  ? (First extends Array<any> 
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]) 
  : []
```

스프레드 연산자와 함께 넣어줬더니 해결이 됐다



## Append to object

주어진 인터페이스에 새로운 필드를 추가한 object 타입을 구현하세요. 이 타입은 세 개의 인자를 받습니다.

예시:

```ts
type Test = { id: '1' }
type Result = AppendToObject<Test, 'value', 4> // expected to be { id: '1', value: 4 }
```

```ts
type test1 = {
  key: 'cat'
  value: 'green'
}

type testExpect1 = {
  key: 'cat'
  value: 'green'
  home: boolean
}

type test2 = {
  key: 'dog' | undefined
  value: 'white'
  sun: true
}

type testExpect2 = {
  key: 'dog' | undefined
  value: 'white'
  sun: true
  home: 1
}

type test3 = {
  key: 'cow'
  value: 'yellow'
  sun: false
}

type testExpect3 = {
  key: 'cow'
  value: 'yellow'
  sun: false
  moon: false | undefined
}

type cases = [
  Expect<Equal<AppendToObject<test1, 'home', boolean>, testExpect1>>,
  Expect<Equal<AppendToObject<test2, 'home', 1>, testExpect2>>,
  Expect<Equal<AppendToObject<test3, 'moon', false | undefined>, testExpect3>>,
]

```

### 문제 분석

객체에 키와 벨류를 제네릭에 넣어서 합친 객체를 만드는 유틸리티 함수이다

키를 어떻게 인식시킬 것이냐가 관건이듯 하다



### 첫번째 접근

```ts
type AppendToObject<T, U, V> = {[P in keyof T]: T[P]} & {[P in keyof U as P extends U ? P : never]: V}
```

U라는 string을 key로 넣기 위해 시도해봤다



### 정답

```ts
type AppendToObject<T, U extends string, V> = {
  [K in keyof T | U]: K extends keyof T ? T[K] : V;
};
```

시도해본 방식 중에 `[K in keyof {...keyof T, U} ]`이런식의 이상한 방식을 시도했었는데, 이를 제대로 구현한 버전이었다.

유니온 타입으로 keyof T 순회에 U를 더해준 다음에 value는 T에 포함된 경우에는 복사 아닌때는 V로 더해준다

```ts
type AppendToObject<T, U extends string, V> = {
  [K in keyof T | U]: K extends U ? V : T[K];
};
```

이것도 얼핏 똑같아 보이지만 extends의 false 영역에는 변수가 전달이 안되어 틀린 답이다.



## Absolute

number, string, 혹은 bigint을 받는 `Absolute` 타입을 만드세요. 출력은 양수 문자열이어야 합니다.

예시:

```ts
type Test = -100
type Result = Absolute<Test> // expected to be "100"
```

```ts
type cases = [
  Expect<Equal<Absolute<0>, '0'>>,
  Expect<Equal<Absolute<-0>, '0'>>,
  Expect<Equal<Absolute<10>, '10'>>,
  Expect<Equal<Absolute<-5>, '5'>>,
  Expect<Equal<Absolute<'0'>, '0'>>,
  Expect<Equal<Absolute<'-0'>, '0'>>,
  Expect<Equal<Absolute<'10'>, '10'>>,
  Expect<Equal<Absolute<'-5'>, '5'>>,
  Expect<Equal<Absolute<-1_000_000n>, '1000000'>>,
  Expect<Equal<Absolute<9_999n>, '9999'>>,
]
```



### 첫번째 접근

```ts
type Absolute<T extends number | string | bigint> = 
  T extends `${infer first}${infer Rest}` 
    ? first extends '-' 
      ? Rest 
      : T 
    : T
```

문자열인 경우 첫번째 문자열을 infer로 -로 추론하는 방식을 썼다.

그런데 타입이 숫자 타입인 경우 그걸 문자로 받아야 했다.



### 두번째 접근

#### `${T}` 

타입스크립트에서는 템플릿 리터럴에 number, bigunt, boolean, undefined, null과 같은 타입을 넣을 경우

이를 문자열로 변환해준다



```ts
type Absolute<T extends number | string | bigint> = 
  `${T}` extends `${infer first}${infer Rest}` 
    ? first extends '-' 
      ? Rest 
      : `${T}` 
    : `${T}`
```



다른 정답	

```ts
type Absolute<T extends number | string | bigint> = 
  `${T}` extends `-${infer Abs}` 
    ? Abs 
    : `${T}`
```

문자열을 떼고 그게 '-'인지 두번 할필요가 없이 사실 이렇게 하는 방식이 더 자연스럽고 정확했다.



## String to Union

문자열 인수를 입력받는 String to Union 유형을 구현하세요. 출력은 입력 문자열의 Union type이어야 합니다.

예시:

```ts
type Test = "123"
type Result = StringToUnion<Test> // expected to be "1" | "2" | "3"
```

```ts
 type cases = [
  Expect<Equal<StringToUnion<''>, never>>,
  Expect<Equal<StringToUnion<'t'>, 't'>>,
  Expect<Equal<StringToUnion<'hello'>, 'h' | 'e' | 'l' | 'l' | 'o'>>,
  Expect<Equal<StringToUnion<'coronavirus'>, 'c' | 'o' | 'r' | 'o' | 'n' | 'a' | 'v' | 'i' | 'r' | 'u' | 's'>>,
```

### 문제 분석

문자열을 하나씩 유니온으로 변환한다



### 첫번째 접근 - 정답

```ts
type StringToUnion<T extends string, Result = never> = 
	T extends `${infer First}${infer Rest}` 
		? StringToUnion<Rest, First | Result> 
		: Result
```

제네릭에 결과값을 넣어두고 infer와 템플릿 리터럴로 문자열 하나씩 재귀로 넣어준다.



## Merge

두개의 타입을 새로운 타입으로 병합하세요. 두번째 타입의 Key가 첫번째 타입을 덮어씁니다(재정의합니다)

예시:

```ts
type foo = {
  name: string
  age: string
}
type coo = {
  age: number
  sex: string
}

type Result = Merge<foo, coo> // expected to be {name: string, age: number, sex: string}
```

```ts
type Foo = {
  a: number
  b: string
}
type Bar = {
  b: number
  c: boolean
}

type cases = [
  Expect<Equal<Merge<Foo, Bar>, {
    a: number
    b: number
    c: boolean
  }>>,
```

### 문제 분석

두개의 객체 타입을 합친다. 이때 겹치는 경우에 뒤에 나오는 타입의 속성 타입으로 override 한다

### 첫번째 접근 - 정답

```ts
type Merge<F, S> = 
  {
    [P in keyof F | keyof S]: 
      P extends keyof S 
        ? S[P] 
        : P extends keyof F
          ? F[P]
          : never
  }   
```

F와 S의 keyof 타입을 map 해서 value값에는 각각 포함됐는지 확인하되 S를 먼저 확인한다.

