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

