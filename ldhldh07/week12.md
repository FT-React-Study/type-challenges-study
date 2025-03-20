# week12

Do you know `lodash`? `Chunk` is a very useful function in it, now let's implement it. `Chunk<T, N>` accepts two required type parameters, the `T` must be a `tuple`, and the `N` must be an `integer >=1`

```ts
type exp1 = Chunk<[1, 2, 3], 2> // expected to be [[1, 2], [3]]
type exp2 = Chunk<[1, 2, 3], 4> // expected to be [[1, 2, 3]]
type exp3 = Chunk<[1, 2, 3], 1> // expected to be [[1], [2], [3]]
```

```ts
type cases = [
  Expect<Equal<Chunk<[], 1>, []>>,
  Expect<Equal<Chunk<[1, 2, 3], 1>, [[1], [2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3], 2>, [[1, 2], [3]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 2>, [[1, 2], [3, 4]]>>,
  Expect<Equal<Chunk<[1, 2, 3, 4], 5>, [[1, 2, 3, 4]]>>,
  Expect<Equal<Chunk<[1, true, 2, false], 2>, [[1, true], [2, false]]>>,
]
```



### 문제 분석

 두번째 제네릭에 있는 숫자만큼 묶는다.

단 남은 갯수가 그보다 작을때는 남은 갯수만큼만 담는다



### 첫번째 접근

임시 배열을 만들고 거기에 하나씩 더한 다음에 그 배열의 length가 두번째 제네릭으로 입력된 수만큼 되면 result 배열에 저장하는 방식을 했다.



```ts
type Chunk<
  T extends Array<any>, 
  Length extends number, 
  Temp extends Array<any> = [],
  Result extends Array<any> = []
> =
  T extends [infer First, ...infer Rest]
    ? [...Temp, First]['length'] extends Length
      ? Chunk<Rest, Length, [], [...Result, [...Temp, First]]>
      : Chunk<Rest, Length, [...Temp, First], Result>
    : Result
```

이 경우 숫자가 다 맞아떨어지지 않는 경우 처리가 안됐다



### 두번째 접근

```ts
type Chunk<
  T extends Array<any>, 
  Length extends number, 
  Temp extends Array<any> = [],
  Result extends Array<any> = []
> =
  T extends [infer First, ...infer Rest]
    ? [...Temp, First]['length'] extends Length
      ? Chunk<Rest, Length, [], [...Result, [...Temp, First]]>
      : Chunk<Rest, Length, [...Temp, First], Result>
    : Temp extends []
      ? Result
      : [...Result, Temp]
```

만약 temp가 남아있는 상태에서 T가 비어있는 경우(===하나씩 chunk에 넣는게 끝났을 경우)

temp의 배열까지 마지막에 더해준다