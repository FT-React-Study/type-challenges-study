# week12

## Chunk

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



## Fill

Fill`, a common JavaScript function, now let us implement it with types. `Fill<T, N, Start?, End?>`, as you can see,`Fill` accepts four types of parameters, of which `T` and `N` are required parameters, and `Start` and `End` are optional parameters. The requirements for these parameters are: `T` must be a `tuple`, `N` can be any type of value, `Start` and `End` must be integers greater than or equal to 0.

```ts
type exp = Fill<[1, 2, 3], 0> // expected to be [0, 0, 0]
```



In order to simulate the real function, the test may contain some boundary conditions, I hope you can enjoy it :)



```ts
type cases = [
  Expect<Equal<Fill<[], 0>, []>>,
  Expect<Equal<Fill<[], 0, 0, 3>, []>>,
  Expect<Equal<Fill<[1, 2, 3], 0, 0, 0>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], 0, 2, 2>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], 0>, [0, 0, 0]>>,
  Expect<Equal<Fill<[1, 2, 3], true>, [true, true, true]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 0, 1>, [true, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 1, 3>, [1, true, true]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 10, 0>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 10, 20>, [1, 2, 3]>>,
  Expect<Equal<Fill<[1, 2, 3], true, 0, 10>, [true, true, true]>>,
]
```



### 문제 분석

시작index와 끝 index를 제시한 이후에 그 범위에 있는 배열의 원소를 N으로 바꿔주는 유틸리티 함수이다.



### 첫번째 접근 - 정답

```ts
type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
  CurrentIndexArray extends Array<any> = [],
  Result extends Array<any> = [],
  IsInRange extends boolean = false,
> =
T extends [infer First, ...infer Rest]
  ? CurrentIndexArray['length'] extends End
    ? Fill<Rest, N, Start, End, [...CurrentIndexArray, any], [...Result, First], false>
    : IsInRange extends true
      ? Fill<Rest, N, Start, End, [...CurrentIndexArray, any], [...Result, N], true>
      : CurrentIndexArray['length'] extends Start
        ? Fill<Rest, N, Start, End, [...CurrentIndexArray, any], [...Result, N], true>
        : Fill<Rest, N, Start, End, [...CurrentIndexArray, any], [...Result, First], false>
  : Result
```

가상의 배열을 이용해 현재 배열의 인덱스를 체크해주고, 해당 인덱스를 통해 start, end에 따라 범위에 있는 지 flag 변수를 하나 둬서 

인덱스가 start, end가 아닐때는 이 변수를 통해 기존 배열의 값 - First를 넣을지 N을 넣을지 판단한다



### 더 나은 정답

```ts
type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
  Result extends Array<any> = [],
  IsInRange extends boolean = false,
> =
T extends [infer First, ...infer Rest]
  ? Result['length'] extends End
    ? Fill<Rest, N, Start, End, [...Result, First], false>
    : IsInRange extends true
      ? Fill<Rest, N, Start, End, [...Result, N], true>
      : Result['length'] extends Start
        ? Fill<Rest, N, Start, End, [...Result, N], true>
        : Fill<Rest, N, Start, End, [...Result, First], false>
  : Result
```

다시 답을 보니 Result가 어차피 인덱스에 따라 하나씩 추가될 것이기 때문에 가상의 배열이 필요없었고 Result로 대체했다.

## Trim Right

Implement `TrimRight<T>` which takes an exact string type and returns a new string with the whitespace ending removed.

For example:

```ts
type Trimed = TrimRight<'   Hello World    '> // expected to be '   Hello World'
```

```ts
type cases = [
  Expect<Equal<TrimRight<'str'>, 'str'>>,
  Expect<Equal<TrimRight<'str '>, 'str'>>,
  Expect<Equal<TrimRight<'str     '>, 'str'>>,
  Expect<Equal<TrimRight<'     str     '>, '     str'>>,
  Expect<Equal<TrimRight<'   foo bar  \n\t '>, '   foo bar'>>,
  Expect<Equal<TrimRight<''>, ''>>,
  Expect<Equal<TrimRight<'\n\t '>, ''>>,
]
```



### 문제 분석

오른쪽의 공백을 없에주는 유틸리티 함수이다



### 첫번째 접근 - 정답

```ts
type TrimRight<S extends string> = 
  S extends `${infer Head}${' '|'\n'|`\t`}` 
    ? TrimRight<Head> 
    : S
```



예전에 한 trim과 같은 방식으로 했더니 됐다.



## Without

Implement the type version of Lodash.without, Without<T, U> takes an Array T, number or array U and returns an Array without the elements of U.

```ts
type Res = Without<[1, 2], 1>; // expected to be [2]
type Res1 = Without<[1, 2, 4, 1, 5], [1, 2]>; // expected to be [4, 5]
type Res2 = Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>; // expected to be []
```



```ts
type cases = [
  Expect<Equal<Without<[1, 2], 1>, [2]>>,
  Expect<Equal<Without<[1, 2, 4, 1, 5], [1, 2]>, [4, 5]>>,
  Expect<Equal<Without<[2, 3, 2, 3, 2, 3, 2, 3], [2, 3]>, []>>,
]
```

### 문제분석

T의 배열에서 원소가 U인 경우 해당 원소를 뺀다

### 첫번째 접근 - 정답

```ts
type Without<T, U> = 
  T extends [infer First, ...infer Rest]
    ? First extends U 
      ? Without<Rest, U>
      : [First, ...Without<Rest, U>]
    : [First, ...Without<Rest, U>]
```

T의 원소 하나씩 보면서 U면 없에면서 재귀
