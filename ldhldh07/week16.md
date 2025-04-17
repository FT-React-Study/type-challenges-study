# week16

## FIlter

원시 타입 또는 유니온 원시 타입인 `Predicate`과 `Predicate`의 요소로 포함되는 배열을 반환하고, 배열 `T`를 가지는 `Filter<T, Predicate>` 타입을 구현하세요.

```ts
type cases = [
  Expect<Equal<Filter<[0, 1, 2], 2>, [2]>>,
  Expect<Equal<Filter<[0, 1, 2], 0 | 1>, [0, 1]>>,
  Expect<Equal<Filter<[0, 1, 2], Falsy>, [0]>>,
]
```



### 문제 분석

배열로 받아 배열로 반환한다.

Predicate와 equal이 아닌 포함되는 조건으로 배열을 필터링한다.



### 첫번째 접근

```ts
type Filter<T extends any[], P> = 
  T extends [infer First, ...infer Rest]  
    ? First extends P
      ? [First ,...Filter<Rest, P>]
      : Filter<Rest, P>
    : []
```

포함되거나 해당 타입이 되는지 판단은 extends로 가능하기에 

기초적인 방식으로 해도 정답이 맞았다.



## FindAll

Given a pattern string P and a text string T, implement the type `FindAll<T, P>` that returns an Array that contains all indices (0-indexed) from T where P matches.

```ts
type cases = [
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', 'Type'>, [14]>>,
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', 'pe'>, [16, 27]>>,
  Expect<Equal<FindAll<'Collection of TypeScript type challenges', ''>, []>>,
  Expect<Equal<FindAll<'', 'Type'>, []>>,
  Expect<Equal<FindAll<'', ''>, []>>,
  Expect<Equal<FindAll<'AAAA', 'A'>, [0, 1, 2, 3]>>,
  Expect<Equal<FindAll<'AAAA', 'AA'>, [0, 1, 2]>>,
]
```



### 문제 분석

문자열 내에서 P문자열을 찾고 그 인덱스를 반환한다.



### 첫번째 접근

```ts
type StringToArray<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? [First, ...StringToArray<Rest>]
    : [];

type FindAll<T extends string, P extends string, Prev extends string= ''> =
  P extends '' ? [] :
  T extends `${infer Head}${P}${infer Tail}`
    ? [StringToArray<`${Head}${Prev}`>['length'], ...FindAll<Tail, P, `${Prev}${Head}${P}`>]
    : []
```

템플릿 리터럴에 infer를 넣은 형태를 통해 문자가 위치한 곳을 찾는다

그리고 그 앞에 있는 글자들의 길이를 통해 인덱스를 구한다.



이 경우 문자열을 찾은 경우에 해당 문자열을 기준으로 자르고 뒤에 남은 문자열로 구했기 때문에 P에 해당하는 문자열이 겹쳐있는 케이스가 안됐다



### 두번째 접근

```ts
type StringToArray<S extends string> =
  S extends `${infer First}${infer Rest}`
    ? [First, ...StringToArray<Rest>]
    : [];

type FindAll<T extends string, P extends string, Prev extends string= ''> =
  P extends '' 
    ? [] 
    : T extends `${infer Head}${P}${infer Tail}`
      ? P extends `${infer First}${infer Rest}`
        ? [StringToArray<`${Prev}${Head}`>['length'], ...FindAll<`${Rest}${Tail}`, P, `${Prev}${Head}${First}`>]
        : []
      : []
```

그래서 P를 찾아낸 후에 P를 첫글자와 나머지 글자로 나눈 후

재귀할때는 그 첫번째 문자를 기준으로 그 뒤에서부터 재귀하도록 설정했다.