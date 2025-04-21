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



### 두번째 접근 - 정답

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



## Combination Key Type

1. Combine multiple modifier keys, but the same modifier key combination cannot appear.
2. In the `ModifierKeys` provided, the priority of the previous value is higher than the latter value; that is, `cmd ctrl` is OK, but `ctrl cmd` is not allowed.

```ts
type ModifierKeys = ['cmd', 'ctrl', 'opt', 'fn']
type CaseTypeOne = 'cmd ctrl' | 'cmd opt' | 'cmd fn' | 'ctrl opt' | 'ctrl fn' | 'opt fn'

type cases = [
  Expect<Equal<Combs<ModifierKeys>, CaseTypeOne>>,
]
```



### 문제 분석

문자열 배열중에 두개씩 짝을 묶은 조합들의 모든 경우의 수를 반환한다.

이때 원소의 순서를 조합 또한 따라야 한다.



### 첫번째 접근 - 정답

```ts
type Combs<T extends any[]> = 
  T extends [infer First extends string, ...infer Rest]
    ? (Rest[number] extends infer S extends string ? `${First} ${S}` : never) | Combs<Rest>
    : never
```

배열을 첫 원소와 나머지로 쪼갠 후

나머지를 유니언으로 바꾼다. 유니언의 분배법칙을 이용해서 First랑 유니온의 각값들의 조합들을 합친 문자열을 또 유니언으로 반환받을 수 있었다.

그리고 Rest로 재귀하면 모든 경우의 수를 이룰 수 있다.



원소를 하나씩 빼서 앞에 위치하도록 하기 때문에 순서에 대한 요구사항과도 맞아떨어진다.



#### 분배법칙과 infer

```ts
Rest[number] extends infer S extends string
```

유니언 타입 분배법칙 사용할 때 infer를 이용해서 타입 변수를 만들고 이를 string으로 해서 이후 템플릿 리터럴에 에러가 뜨지 않도록 할 수 있었다.



## Permutation of Tuple

Given a generic tuple type `T extends unknown[]`, write a type which produces all permutations of `T` as a union.

For example:

```ts
PermutationsOfTuple<[1, number, unknown]>
// Should return:
// | [1, number, unknown]
// | [1, unknown, number]
// | [number, 1, unknown]
// | [unknown, 1, number]
// | [number, unknown, 1]
// | [unknown, number ,1]
```

```ts
type cases = [
  Expect<Equal<PermutationsOfTuple<[]>, []>>,
  Expect<Equal<PermutationsOfTuple<[any]>, [any]>>,
  Expect<Equal<PermutationsOfTuple<[any, unknown]>, [any, unknown] | [unknown, any]>>,
  Expect<Equal<
    PermutationsOfTuple<[any, unknown, never]>,
    | [any, unknown, never]
    | [unknown, any, never]
    | [unknown, never, any]
    | [any, never, unknown]
    | [never, any, unknown]
    | [never, unknown, any]
  >>,
  Expect<Equal<
    PermutationsOfTuple<[1, number, unknown]>,
    | [1, number, unknown]
    | [1, unknown, number]
    | [number, 1, unknown]
    | [unknown, 1, number]
    | [number, unknown, 1]
    | [unknown, number, 1]
  >>,
  ExpectFalse<Equal<PermutationsOfTuple<[ 1, number, unknown ]>, [unknown]>>,
]
```



### 문제 분석

배열을 받아서 해당 원소들로 구성된 모든 순열의 경우를 다시 배열로 반환한다.



### 정답

```ts
type PermutationsOfTuple<
  T extends unknown[], 
  Prev extends unknown[] = []
> = 
  T extends [infer First, ...infer Rest] 
    ? [First, ...PermutationsOfTuple<[...Prev, ...Rest]>] 
      | (Rest extends []
          ? never 
          : PermutationsOfTuple<Rest, [...Prev, First]>) 
    : T
```

원소들을 하나씩 순회하고 그 원소, 그리고 나머지를 다시 순열로 재귀로 돌려서 풀고자 하는 방향성을 잡았다.

그리고 그 나머지는 prev를 통해 이전에 검사한 원소들가

하지만 실제 구현은 잘 못하겠어서 답에서 같은 로직을 사용한 답을 찾아서 참고했다.



## Replace First

```ts
type ReplaceFirst<T extends readonly unknown[], S, R> = 
  T extends [infer First, ...infer Rest]
    ? First extends S
      ? [R, ...Rest]
      : [First, ...ReplaceFirst<Rest, S, R>]
    : T
```

```ts
type cases = [
  Expect<Equal<ReplaceFirst<[1, 2, 3], 3, 4>, [1, 2, 4]>>,
  Expect<Equal<ReplaceFirst<['A', 'B', 'C'], 'C', 'D'>, ['A', 'B', 'D']>>,
  Expect<Equal<ReplaceFirst<[true, true, true], true, false>, [false, true, true]>>,
  Expect<Equal<ReplaceFirst<[string, boolean, number], boolean, string>, [string, string, number]>>,
  Expect<Equal<ReplaceFirst<[1, 'two', 3], string, 2>, [1, 2, 3]>>,
  Expect<Equal<ReplaceFirst<['six', 'eight', 'ten'], 'eleven', 'twelve'>, ['six', 'eight', 'ten']>>,
]
```



### 문제 분석

배열을 받아 두번째 제네릭으로 들어가는 인자와 원소와 같은 경우 세번째 제네릭으로 들어가는 인자로 바꿔서 반환한다.

이때 같은 모든 원소를 바꾸는 것이 아니라 같은 원소중 첫번째 것만 바꿔준다.



### 첫번째 접근

```ts
type ReplaceFirst<T extends readonly unknown[], S, R> = 
  T extends [infer First, ...infer Rest]
    ? (<T>() => T extends First ? 1 : 2) extends
      (<T>() => T extends S ? 1: 2)
      ? [R, ...ReplaceFirst<Rest, S, R>]
      : [First, ...ReplaceFirst<Rest, S, R>]
    : T
```

두가지 요구사항을 고려하지 않았다

- 첫번째 원소만 바꿔준다는 점
- 완전히 같은 타입이 아닌 extends 되는 것이 기준이라는 점



### 두번째 접근 - 정답

```ts
type ReplaceFirst<T extends readonly unknown[], S, R> = 
  T extends [infer First, ...infer Rest]
    ? First extends S
      ? [R, ...Rest]
      : [First, ...ReplaceFirst<Rest, S, R>]
    : T
```

그래서 먼저 First를 S에 그냥 extends 했다.

그리고 맞는 경우에 그냥 First만 R로 바꾸고 나머지는 재귀를 돌리는 것이 아니라 Rest를 그대로 스프레드해서 반환했다.



## Transpose

The transpose of a matrix is an operator which flips a matrix over its diagonal; that is, it switches the row and column indices of the matrix A by producing another matrix, often denoted by AT.

```ts
type Matrix = Transpose <[[1]]>; // expected to be [[1]]
type Matrix1 = Transpose <[[1, 2], [3, 4]]>; // expected to be [[1, 3], [2, 4]]
type Matrix2 = Transpose <[[1, 2, 3], [4, 5, 6]]>; // expected to be [[1, 4], [2, 5], [3, 6]]
```

```ts
type cases = [
  Expect<Equal<Transpose<[]>, []>>,
  Expect<Equal<Transpose<[[1]]>, [[1]]>>,
  Expect<Equal<Transpose<[[1, 2]]>, [[1], [2]]>>,
  Expect<Equal<Transpose<[[1, 2], [3, 4]]>, [[1, 3], [2, 4]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6]]>, [[1, 4], [2, 5], [3, 6]]>>,
  Expect<Equal<Transpose<[[1, 4], [2, 5], [3, 6]]>, [[1, 2, 3], [4, 5, 6]]>>,
  Expect<Equal<Transpose<[[1, 2, 3], [4, 5, 6], [7, 8, 9]]>, [[1, 4, 7], [2, 5, 8], [3, 6, 9]]>>,
]
```



### 문제 분석

2차 배열 형식의 배열 타입을 받아서 행과열을 뒤집어서 반환한다.



### 첫번째 접근 - 정답

```ts
type Transpose<
  M extends unknown[][],
  RowIndexArray extends any[] = [],
  ColumIndexArray extends any[] = [],
  TempRow extends any[] = [],
  Result extends unknown[][] = [],
> = 
  RowIndexArray['length'] extends M[0]['length']
    ? Result
    : ColumIndexArray['length'] extends M['length']
      ? Transpose<M, [...RowIndexArray, any], [], [], [...Result, TempRow]>
      : Transpose<M, RowIndexArray, [...ColumIndexArray, any], [...TempRow, M[ColumIndexArray['length']][RowIndexArray['length']]], Result>
```



인덱스 탐색을 이용해서 행과 열을 하나씩 더하면서 해당 행렬에 대해서 뒤집어진 인덱스로 M을 탐색해서 결과에 추가했다.
