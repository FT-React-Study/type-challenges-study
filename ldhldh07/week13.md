# week13

## Join

Implement the type version of Array.join, Join<T, U> takes an Array T, string or number U and returns the Array T with U stitching up.

```ts
type Res = Join<["a", "p", "p", "l", "e"], "-">; // expected to be 'a-p-p-l-e'
type Res1 = Join<["Hello", "World"], " ">; // expected to be 'Hello World'
type Res2 = Join<["2", "2", "2"], 1>; // expected to be '21212'
type Res3 = Join<["o"], "u">; // expected to be 'o'
```

```ts
type cases = [
  Expect<Equal<Join<['a', 'p', 'p', 'l', 'e'], '-'>, 'a-p-p-l-e'>>,
  Expect<Equal<Join<['Hello', 'World'], ' '>, 'Hello World'>>,
  Expect<Equal<Join<['2', '2', '2'], 1>, '21212'>>,
  Expect<Equal<Join<['o'], 'u'>, 'o'>>,
  Expect<Equal<Join<[], 'u'>, ''>>,
  Expect<Equal<Join<['1', '1', '1']>, '1,1,1'>>,
]

```



### 문제분석

문자열 배열를 입력받아 합쳐준다. 배열 원소 사이사이에는 두번째 제네릭으로 입력된 문자열 혹은 숫자가 들어간다.

숫자는 문자열로 변환되어 입력된다.



### 첫번째 접근 - 정답

```ts
type Join<T extends any[], U extends string | number =','> = 
  T extends [infer First, ...infer Rest]
    ? Rest extends []
      ? First
      : First extends string 
        ? `${First}${U}${Join<Rest, U>}`
        : never
    : ''
```

템플릿 리터럴과 재귀를 활용했다.

Rest가 빈 배열일때 First가 마지막 원소일 때이므로 이때는 U를 더해주지 않았다.



## LastIndexOf

Implement the type version of `Array.lastIndexOf`, `LastIndexOf<T, U>` takes an Array `T`, any `U` and returns the index of the last `U` in Array `T`

For example:

```ts
type Res1 = LastIndexOf<[1, 2, 3, 2, 1], 2> // 3
type Res2 = LastIndexOf<[0, 0, 0], 2> // -1
```

```ts
type cases = [
  Expect<Equal<LastIndexOf<[1, 2, 3, 2, 1], 2>, 3>>,
  Expect<Equal<LastIndexOf<[2, 6, 3, 8, 4, 1, 7, 3, 9], 3>, 7>>,
  Expect<Equal<LastIndexOf<[0, 0, 0], 2>, -1>>,
  Expect<Equal<LastIndexOf<[string, 2, number, 'a', number, 1], number>, 4>>,
  Expect<Equal<LastIndexOf<[string, any, 1, number, 'a', any, 1], any>, 5>>,
]
```



### 문제 분석

인덱스 중에서 마지막에 해당하는 인덱스를 찾아서 반환한다.



### 첫번째 접근 - 정답

```ts
type LastIndexOf<T, U, IndexArray extends Array<any> = [], Result extends number = -1> =
  T extends [infer First, ...infer Rest]
    ? (<A>() => A extends First ? 1 : 2) extends
      (<A>() => A extends U ? 1 : 2)
      ? LastIndexOf<Rest, U, [...IndexArray, any], IndexArray['length']>
      : LastIndexOf<Rest, U, [...IndexArray, any], Result>
    : Result
```

그냥 인덱스는 U에 해당하는 원소가 나오면 바로 인덱스를 반환했다. lastIndexof는 그 대신 result에다가 U와 같은 원소의 인덱스 값을 갱신하고 보존한다. 그리고 순회가 다 끝나면 그때 마지막으로 u랑 일치했던 인덱스값을 반환한다.