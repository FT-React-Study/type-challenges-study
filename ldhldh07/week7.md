# week7

## diff

`O` & `O1`의 차이점인 `객체`를 가져옵니다

```ts
type Foo = {
  name: string
  age: string
}
type Bar = {
  name: string
  age: string
  gender: number
}
type Coo = {
  name: string
  gender: number
}

type cases = [
  Expect<Equal<Diff<Foo, Bar>, { gender: number }>>,
  Expect<Equal<Diff<Bar, Foo>, { gender: number }>>,
  Expect<Equal<Diff<Foo, Coo>, { age: string, gender: number }>>,
  Expect<Equal<Diff<Coo, Foo>, { age: string, gender: number }>>,
]
```



### 첫번째 접근

```ts
type Diff<O, O1> = {[P in keyof O as P extends keyof O1 ? never : P]: O[P] } & {[P in keyof O1 as P extends keyof O ? never : P]: O1[P]}
```

&를 하면 안될 것 같았지만 한번 해봤다.



### 두번째 접근

```ts
type Diff<O, O1> = {
  [P in keyof O | keyof O1
     as P extends O 
      ? P extends O1 
        ? never 
        : P 
      : P extends O1 
        ? P 
        : never]
    : Merge<O, O1>[P] 
}
```

as 구문을 통해 key값을 빼려 했다



### 세번째 접근

```ts
type Diff<O, O1> = {
  [P in (
    (keyof O extends keyof O1 ? never : keyof O) & (keyof O1 extends O ? never : keyof O1)
  )] : 
    P extends keyof O 
        ? O[P] 
        : P extends keyof O1 
          ? O1[P]
          : never
}
```



### 네번째 접근 - 정답

```ts
type Diff<O, O1, U extends string | number | symbol  = keyof O | keyof O1, A = keyof O1 & keyof O> = {
  [P in (
    (U extends A ? never : U)
  )] : 
    P extends keyof O 
        ? O[P] 
        : P extends keyof O1 
          ? O1[P]
          : never
}
```

gpt에게 약간의 힌트를 얻고 진행했다.

벤다이어그램을 떠올리면 diff는 합집합에서 교집합을 뺀 것이다.

해당 개념을 이용해서 key값을 정했고 value값은 각각 두개의 타입에서 찾아서 넣었다.



#### 유니온 & 유니온

유니온을 & 로 이을 경우 두 유니온 타입에서 겹치는 부분만 남긴 유니온 타입으로 연산된다.

유니온 | 유니온은 두 유니온의 합집합이라는 개념은 막연하게 알고 있었는데 유니온 & 유니온이 교집합인 부분은 확 떠오르는 부분은 아니었다.

## Anyof

Python의 `any` function을 타입 시스템으로 구현하세요

배열을 사용하고 배열의 요소가 참이면 `true`를 반환합니다. 배열이 비어 있으면 `false`를 반환합니다

예시:

```ts
type Sample1 = AnyOf<[1, "", false, [], {}]> // expected to be true.
type Sample2 = AnyOf<[0, "", false, [], {}]> // expected to be false.
```

```ts
type cases = [
  Expect<Equal<AnyOf<[1, 'test', true, [1], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[1, '', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, 'test', false, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', true, [], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [1], {}]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], { name: 'test' }, { 1: 'test' }]>, true>>,
  Expect<Equal<AnyOf<[0, '', false, [], {}, undefined, null]>, false>>,
  Expect<Equal<AnyOf<[]>, false>>,
]
```



### 문제 분석

배열이 제네릭으로 입력됐을 때, 해당 배열에서 하나라도 파이썬의 true (0, '', []. {}, null, undefined, false가 아닌 값)이 있을 경우 ture, 모두 false일 경우 false를 반환한다



### 첫번째 접근

```ts
type AnyOf<T extends readonly any[]> = 
    T extends [infer First, ...infer Rest]
      ? First extends (false| 0| ''| [] | {} |undefined| null)
        ? AnyOf<Rest>
        : true
      : false
```

하나씩 배열에 있는 값을 infer로 쓰면서 First가 false에 해당하는 경우 Rest로 계속 검사 진행하고, true에 해당하든 경우 바로 true를 반환하도록 했다.

그리고 배열에 있는 모든값을 검사후 false가 나온경우 Rest가 빈배열이 된다. 그 경우 T가 infer에 패턴 매칭이 되지 않아 false를 반환하도록 했다



#### {} 타입

`[]`나 `''`와 달리 `{}` 타입은 빈 객체을 의미하지 않는다.

오히려 값이 존재하는 모든 객체 형태의 타입을 할당할 수 있는 포괄적인 타입이다.

```ts
// 빈 객체
type Test = {} extends {} ? true : false;  // true

// 객체
type Test2 = { name: string } extends {} ? true : false;  // true

// 배열
type Test3 = [] extends {} ? true : false;  // true
type Test4 = [1,3] extends {} ? true : false;  // true

// 함수
type Test5 = Function extends {} ? true : false;  // true 

// 문자열
type Test6 = '하이' extends {} ? true : false;  // true

// 값이 존재하지 않는 타입
type Test7 = null extends {} ? true : false;  // false
type Test8 = undefined extends {} ? true : false;  // false
```

`null`과 `undefined`를 제뇌한 모든 타입이 {}에 할당했을 때 true를 반환한다.



####  빈 객체 타입

그렇기 때문에 빈 객체 타입을 평가할 때는 

```ts
{ [K: string]: never }
```

를 사용한다.



#### 정답

```ts
type AnyOf<T extends readonly any[]> = 
    T extends [infer First, ...infer Rest]
      ? First extends (false | 0 | '' | [] |  { [K: string]: never } | undefined | null)
        ? AnyOf<Rest>
        : true
      : false
```

`{}` 대신 `{ [K; string]: never }`를 사용하였고 정답이다

