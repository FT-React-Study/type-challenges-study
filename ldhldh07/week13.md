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



## Unique

Implement the type version of Lodash.uniq, Unique takes an Array T, returns the Array T without repeated values.

```ts
type Res = Unique<[1, 1, 2, 2, 3, 3]>; // expected to be [1, 2, 3]
type Res1 = Unique<[1, 2, 3, 4, 4, 5, 6, 7]>; // expected to be [1, 2, 3, 4, 5, 6, 7]
type Res2 = Unique<[1, "a", 2, "b", 2, "a"]>; // expected to be [1, "a", 2, "b"]
type Res3 = Unique<[string, number, 1, "a", 1, string, 2, "b", 2, number]>; // expected to be [string, number, 1, "a", 2, "b"]
type Res4 = Unique<[unknown, unknown, any, any, never, never]>; // expected to be [unknown, any, never]
```

```ts
type cases = [
  Expect<Equal<Unique<[1, 1, 2, 2, 3, 3]>, [1, 2, 3]>>,
  Expect<Equal<Unique<[1, 2, 3, 4, 4, 5, 6, 7]>, [1, 2, 3, 4, 5, 6, 7]>>,
  Expect<Equal<Unique<[1, 'a', 2, 'b', 2, 'a']>, [1, 'a', 2, 'b']>>,
  Expect<Equal<Unique<[string, number, 1, 'a', 1, string, 2, 'b', 2, number]>, [string, number, 1, 'a', 2, 'b']>>,
  Expect<Equal<Unique<[unknown, unknown, any, any, never, never]>, [unknown, any, never]>>,
]
```





### 문제 분석

배열을 받아서 겹치는 원소들을 하나로 바꾸고 반환한다



### 첫번째 접근

map을 이용해서 해결하려고 했다

```ts
type Unique<T, Map = {}> = 
  T extends [infer First, ...infer Rest]
    ? First extends keyof Map
      ? Unique<Rest, Map>
      : Unique<Rest, Map & { [K in First]: true}>
    : Map
```

이 타입의 문제는 맵의 key로 들어가려면 string, number, symbol이라는 프로퍼티키 타입만 가능한데 여기에는 string, any등도 배열안에 들어갈 수 있다



### 두번째 접근 - 정답

```ts
type IsContained<T extends Array<any>, A> = 
  T extends [infer First, ...infer Rest] 
    ? (<B>() => B extends A ? 1 : 2) extends
      (<B>() => B extends First ? 1 : 2)
      ? true
      : IsContained<Rest, A>
    : false

type Unique<T, Result extends Array<any> = []> = 
  T extends [infer First, ...infer Rest]
    ? IsContained<Result, First> extends true
      ? Unique<Rest, Result>
      : Unique<Rest, [...Result, First]>
    : Result
```

그래서 그냥 배열을 하나씩 다 체크하면서 이미 포함된 경우 결과 값에 포한하지 않는 방식으로 진행했다.



## maptypes

Implement `MapTypes<T, R>` which will transform types in object T to different types defined by type R which has the following structure

```
type StringToNumber = {
  mapFrom: string; // value of key which value is string
  mapTo: number; // will be transformed for number
}
```



## Examples:



```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string}, StringToNumber> // gives { iWillBeANumberOneDay: number; }
```



Be aware that user can provide a union of types:

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
type StringToDate = { mapFrom: string; mapTo: Date;}
MapTypes<{iWillBeNumberOrDate: string}, StringToDate | StringToNumber> // gives { iWillBeNumberOrDate: number | Date; }
```



If the type doesn't exist in our map, leave it as it was:

```ts
type StringToNumber = { mapFrom: string; mapTo: number;}
MapTypes<{iWillBeANumberOneDay: string, iWillStayTheSame: Function}, StringToNumber> // // gives { iWillBeANumberOneDay: number, iWillStayTheSame: Function }
```

```ts
type cases = [
  Expect<Equal<MapTypes<{ stringToArray: string }, { mapFrom: string, mapTo: [] }>, { stringToArray: [] }>>,
  Expect<Equal<MapTypes<{ stringToNumber: string }, { mapFrom: string, mapTo: number }>, { stringToNumber: number }>>,
  Expect<Equal<MapTypes<{ stringToNumber: string, skipParsingMe: boolean }, { mapFrom: string, mapTo: number }>, { stringToNumber: number, skipParsingMe: boolean }>>,
  Expect<Equal<MapTypes<{ date: string }, { mapFrom: string, mapTo: Date } | { mapFrom: string, mapTo: null }>, { date: null | Date }>>,
  Expect<Equal<MapTypes<{ date: string }, { mapFrom: string, mapTo: Date | null }>, { date: null | Date }>>,
  Expect<Equal<MapTypes<{ fields: Record<string, boolean> }, { mapFrom: Record<string, boolean>, mapTo: string[] }>, { fields: string[] }>>,
  Expect<Equal<MapTypes<{ name: string }, { mapFrom: boolean, mapTo: never }>, { name: string }>>,
  Expect<Equal<MapTypes<{ name: string, date: Date }, { mapFrom: string, mapTo: boolean } | { mapFrom: Date, mapTo: string }>, { name: boolean, date: string }>>,
]	
```



### 문제 분석

R에 mapFrom, mapTo가 있어서 mapFrom의 벨류값이 T의 값들중에 맞는게 있으면 mapTo의 벨류로 바꾼다



### 첫번째 접근

```ts
type MapTypes<T, R extends {mapFrom: any, mapTo: any}> = 
  {[K in keyof T]: T[K] extends R['mapFrom'] ? R['mapTo'] : T[K]}
```

R을 한정해주고 매핑타입으로 제한해주었다

이 경우 R['mapFrom']이 유니온타입으로 들어가서 마지막 케이스가 제대로 작동하지 않았다



### 두번째 접근 - 정답

```ts
type NeverToOriginalValue<T, OriginalT> = 
  {[K in keyof T]: T[K] extends never ? K extends keyof OriginalT ? OriginalT[K] : never : T[K] }

type MapTypes<T, R extends {mapFrom: any, mapTo: any}> = 
  NeverToOriginalValue<{[K in keyof T]: 
      R extends any
        ? T[K] extends R['mapFrom'] 
          ? R['mapTo']
          : never
        : never
  }, T>

```

유니온 값을 분배 법칙을 사용해서 각각 쓸때 유니온 타입 중에 해당하지 않는건 제외하기 위해 never를 사용했다.

다만 이때 아무것도 해당하지 않을때 never를 반환해주는데 그 경우 기존의 값을 쓰도록 했다.



### 또다른 정답

```ts
type MapTo<V, R extends {mapFrom: any, mapTo: any}> = 
  R extends any
  ? V extends R['mapFrom']
    ? R['mapTo']
    : never
  : never

type MapTypes<T, R extends { mapFrom: any; mapTo: any }> = {
  [K in keyof T]:
    MapTo<T[K], R> extends never ? T[K] : MapTo<T[K], R>
}
```

mapTo를 분배법칙하는걸 따로 유틸리티 타입을 만들고 never체크를 전체 유틸리티 타입에서 하는것이 더 자연스럽고 최적화된 로직이었다.