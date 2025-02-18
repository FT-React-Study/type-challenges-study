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



## IsNever

input type으로 `T`를 받는 IsNever type을 구현하세요. 만약 `T`의 유형이 `never`으로 확인되면 `true`를 반환하고 아니면 `false`를 반환합니다

예시:

```ts
type A = IsNever<never> // expected to be true
type B = IsNever<undefined> // expected to be false
type C = IsNever<null> // expected to be false
type D = IsNever<[]> // expected to be false
type E = IsNever<number> // expected to be false
```

```ts
type cases = [
  Expect<Equal<IsNever<never>, true>>,
  Expect<Equal<IsNever<never | string>, false>>,
  Expect<Equal<IsNever<''>, false>>,
  Expect<Equal<IsNever<undefined>, false>>,
  Expect<Equal<IsNever<null>, false>>,
  Expect<Equal<IsNever<[]>, false>>,
  Expect<Equal<IsNever<{}>, false>>,
]
```

### 첫번째 접근 - 정답

```ts
type IsNever<T> = [T] extends [never] ? true : false
```

Permutation에서의 교훈으로 never를 평가하기 위해서는 [T] extends [never]를 해야한다



#### 조건부 타입에서 never

```ts
type Test = never extends never ? true : false; // true

type IsNever<T> = T extends never ? true : false;
type A = IsNever<never>; // never
```

never가 타입으로 들어갔을때는 true로 반환하지만 제네릭으로 never가 들어갈 경우 never로 반환하는 이유

extends의 분배 법칙 때문이라고 한다.



T에 제네릭으로 never가 들어가는 경우 공집합으로 판단되고 extends가 평가할 타입이 아무것도 없는것으로 되어서 never를 반환한다.

## IsUnion

`T`를 입력으로 받고, `T`가 `Union` 유형으로 확인되는지 여부를 반환하는 `IsUnion`을 구현하세요

예시:

```ts
type case1 = IsUnion<string> // false
type case2 = IsUnion<string | number> // true
type case3 = IsUnion<[string | number]> // false
```

```	ts
type cases = [
  Expect<Equal<IsUnion<string>, false>>,
  Expect<Equal<IsUnion<string | number>, true>>,
  Expect<Equal<IsUnion<'a' | 'b' | 'c' | 'd'>, true>>,
  Expect<Equal<IsUnion<undefined | null | void | ''>, true>>,
  Expect<Equal<IsUnion<{ a: string } | { a: number }>, true>>,
  Expect<Equal<IsUnion<{ a: string | number }>, false>>,
  Expect<Equal<IsUnion<[string | number]>, false>>,
  // Cases where T resolves to a non-union type.
  Expect<Equal<IsUnion<string | never>, false>>,
  Expect<Equal<IsUnion<string | unknown>, false>>,
  Expect<Equal<IsUnion<string | any>, false>>,
  Expect<Equal<IsUnion<string | 'a'>, false>>,
  Expect<Equal<IsUnion<never>, false>>,
]

```



### 정답

```ts
type IsUnion<T, U = T> =  
  [T] extends [never]
    ? false
    : T extends T 
        ? [U] extends [T] 
          ? false 
          : true
        : false
```

T extends T의 형태가 사용될거라고는 생각했는데 뭔가 형태가 복잡했다



T extends T를 했을 때 분배법칙이 일어난다면 T는 해당 유니온의 개별 타입이 된다

그리고 U에는 T유니온의 전체 타입이 되어 extends 되지 못하고 false로 간다



반면 유니온이 아닌 경우 분배가 되지 않아 [U]와 [T]가 같아서 해당 extends의 true로 판단되고 그런 경우 false를 반환한다

####  [U] extends [T]

U extends T가 아니라 [U] extends [T]를 쓰는 이유도 분배법칙 때문이다

U가 T와 같은지 판단해야 하는데 유니온인 경우 개별적으로 판단해서 true | false같이 (이 경우에) 하나만 true인 유니온을 반환한다.



## ReplaceKeys

Union type의 key를 대체하는 ReplaceKeys를 구현하세요. 만약 일부 유형에 해당 key가 존재하지 않는다면 대체하지 않습니다. 타입은 세 개의 인자를 받습니다.

예시:

```ts
type NodeA = {
  type: "A"
  name: string
  flag: number
}

type NodeB = {
  type: "B"
  id: number
  flag: number
}

type NodeC = {
  type: "C"
  name: string
  flag: number
}

type Nodes = NodeA | NodeB | NodeC

type ReplacedNodes = ReplaceKeys<
  Nodes,
  "name" | "flag",
  { name: number; flag: string }
> // {type: 'A', name: number, flag: string} | {type: 'B', id: number, flag: string} | {type: 'C', name: number, flag: string} // would replace name from string to number, replace flag from number to string.

type ReplacedNotExistKeys = ReplaceKeys<Nodes, "name", { aa: number }> // {type: 'A', name: never, flag: number} | NodeB | {type: 'C', name: never, flag: number} // would replace name to never
```

```ts
type NodeA = {
  type: 'A'
  name: string
  flag: number
}

type NodeB = {
  type: 'B'
  id: number
  flag: number
}

type NodeC = {
  type: 'C'
  name: string
  flag: number
}

type ReplacedNodeA = {
  type: 'A'
  name: number
  flag: string
}

type ReplacedNodeB = {
  type: 'B'
  id: number
  flag: string
}

type ReplacedNodeC = {
  type: 'C'
  name: number
  flag: string
}

type NoNameNodeA = {
  type: 'A'
  flag: number
  name: never
}

type NoNameNodeC = {
  type: 'C'
  flag: number
  name: never
}

type Nodes = NodeA | NodeB | NodeC
type ReplacedNodes = ReplacedNodeA | ReplacedNodeB | ReplacedNodeC
type NodesNoName = NoNameNodeA | NoNameNodeC | NodeB

type cases = [
  Expect<Equal<ReplaceKeys<Nodes, 'name' | 'flag', { name: number, flag: string }>, ReplacedNodes>>,
  Expect<Equal<ReplaceKeys<Nodes, 'name', { aa: number }>, NodesNoName>>,
]
```

### 문제 분석

T의 키값을 있는 속성들을 U에 있는 내용으로 바꿔준다

### 첫번째 접근

key값은 override하되 그 값은 U에서 가져오면 된다고 생각했다

```ts
type ReplaceNode =  {[P in keyof NodeA | 'name'] : P extends 'name' | 'flag' ? { name: number, flag: string }[P] : NodeA[P]} 
```

그래서 단일 Node에 대해서 해당 로직을 적용해서 원하는 결과를 내는데 성공했다

근데 그걸 유니온 타입에 적용하는 방법이 관건이었고 그냥 extends any로 분배시키는 방식을 해봤다

```ts
type ReplaceKeys<U, T extends keyof any, Y> = U extends any 
  ? { [P in keyof U | T as P extends keyof U ? P : never] : P extends keyof Y ? Y[P] : P extends keyof U ? U[P] : never }
  : never;
```

이 경우 두번째 케이스에서 Y에 해당 객체가 없음에도 value값이 never가 아닌 기존의 값으로 되는 문제가 있었다



### 두번째 접근 - 정답

```ts
type ReplaceKeys<U, T extends keyof any, Y> = U extends any 
  ? {
      [P in keyof U | T as P extends keyof U 
        ? P 
        : never]: P extends T 
                    ? P extends keyof Y 
                      ? Y[P] 
                      : never 
                    : P extends keyof U 
                      ? U[P] 
                      : never;
    }
  : never;
```

경우를 좀더 쪼개고 keyof에 extends해서 해당 변수를 활용하는 방식으로 해결했다.

