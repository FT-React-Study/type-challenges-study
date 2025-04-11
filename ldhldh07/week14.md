# week14

## Combinations

Given an array of strings, do Permutation & Combination. It's also useful for the prop types like video [controlsList](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/controlsList)

```ts
// expected to be `"foo" | "bar" | "baz" | "foo bar" | "foo bar baz" | "foo baz" | "foo baz bar" | "bar foo" | "bar foo baz" | "bar baz" | "bar baz foo" | "baz foo" | "baz foo bar" | "baz bar" | "baz bar foo"`
type Keys = Combination<['foo', 'bar', 'baz']>
```

```ts
type cases = [
  Expect<Equal<Combination<['foo', 'bar', 'baz']>, 'foo' | 'bar' | 'baz' | 'foo bar' | 'foo bar baz' | 'foo baz' | 'foo baz bar' | 'bar foo' | 'bar foo baz' | 'bar baz' | 'bar baz foo' | 'baz foo' | 'baz foo bar' | 'baz bar' | 'baz bar foo'>>,
  Expect<Equal<Combination<['apple', 'banana', 'cherry']>, 'apple' | 'banana' | 'cherry' |
  'apple banana' | 'apple cherry' | 'banana apple' | 'banana cherry' | 'cherry apple' | 'cherry banana' |
  'apple banana cherry' | 'apple cherry banana' | 'banana apple cherry' | 'banana cherry apple' | 'cherry apple banana' | 'cherry banana apple'>>,
  Expect<Equal<Combination<['red', 'green', 'blue', 'yellow']>, 'red' | 'green' | 'blue' | 'yellow' |
  'red green' | 'red blue' | 'red yellow' | 'green red' | 'green blue' | 'green yellow' | 'blue red' | 'blue green' | 'blue yellow' | 'yellow red' | 'yellow green' | 'yellow blue' |
  'red green blue' | 'red green yellow' | 'red blue green' | 'red blue yellow' | 'red yellow green' | 'red yellow blue' |
  'green red blue' | 'green red yellow' | 'green blue red' | 'green blue yellow' | 'green yellow red' | 'green yellow blue' |
  'blue red green' | 'blue red yellow' | 'blue green red' | 'blue green yellow' | 'blue yellow red' | 'blue yellow green' |
  'yellow red green' | 'yellow red blue' | 'yellow green red' | 'yellow green blue' | 'yellow blue red' | 'yellow blue green' |
  'red green blue yellow' | 'red green yellow blue' | 'red blue green yellow' | 'red blue yellow green' | 'red yellow green blue' | 'red yellow blue green' |
  'green red blue yellow' | 'green red yellow blue' | 'green blue red yellow' | 'green blue yellow red' | 'green yellow red blue' | 'green yellow blue red' |
  'blue red green yellow' | 'blue red yellow green' | 'blue green red yellow' | 'blue green yellow red' | 'blue yellow red green' | 'blue yellow green red' |
  'yellow red green blue' | 'yellow red blue green' | 'yellow green red blue' | 'yellow green blue red' | 'yellow blue red green' | 'yellow blue green red'>>
  ,
  Expect<Equal<Combination<['one', 'two']>, 'one' | 'two' |
  'one two' | 'two one'>>,
]
```



### 문제 분석

배열의 원소들을 받아 그 원소들로 구성할 수 있는 모든 배열의 경우의 수를 유니온으로 반환한다.



### 첫번째 접근

```ts
type Combination<T extends string[], Result = ''> = 
  T extends [infer First, ...infer Rest]
    ? Rest extends string[]
      ? First extends string
        ? Combination<Rest, (Result extends string ? `${Result} ${First}` : never) | Result> 
        : never
      : never
    : Result

/// Combination<['foo', 'bar', 'baz']>
/// "" | " foo" | " bar" | " foo bar" | " baz" | " foo baz" | " bar baz" | " foo bar baz"

```

기본을 빈배열로 두고

배열의 있는 값을 하나씩 빼서 현재의 Result에 이 값을 포함하는 경우와 안포함하는 경우를 추가했다.

근데 이 경우 순서에 따라 다른 경우가 생기지 않았고 맨 앞에 공백이 생기는 문제가 있었다.



### 정답

```ts
type Combination<T extends string[], UnionT = T[number], Possible = UnionT> = 
  Possible extends string
    ? Possible | `${Possible} ${Combination<[], Exclude<UnionT, Possible>>}`
    : never
```

Exclude와 분배법칙, 재귀를 사용해야하겠다는 생각은 했는데 구체적인 구현은 감이 안와서 답을 봤다

포인트는 처음에만 배열을 받고, 제네릭에서 union을 만들어서 재귀시에는 계속 union으로 반복하여 분배법칙을 활용했다.



분배벅칙을 돌리고 분배된 기존 값과 재귀돌린 경우를 유니온으로 합쳐서 조합의 원리를 구성했다.



## Subsequence

Given an array of unique elements, return all possible subsequences.

A subsequence is a sequence that can be derived from an array by deleting some or no elements without changing the order of the remaining elements.

For example:

```ts
type A = Subsequence<[1, 2]> // [] | [1] | [2] | [1, 2]
```

```ts
type cases = [
  Expect<Equal<Subsequence<[1, 2]>, [] | [1] | [2] | [1, 2]>>,
  Expect<Equal<Subsequence<[1, 2, 3]>, [] | [1] | [2] | [1, 2] | [3] | [1, 3] | [2, 3] | [1, 2, 3]>>,
  Expect<Equal<Subsequence<[1, 2, 3, 4, 5]>, [] |
  [1] | [2] | [3] | [4] | [5] |
  [1, 2] | [1, 3] | [1, 4] | [1, 5] | [2, 3] | [2, 4] | [2, 5] | [3, 4] | [3, 5] | [4, 5] |
  [1, 2, 3] | [1, 2, 4] | [1, 2, 5] | [1, 3, 4] | [1, 3, 5] | [1, 4, 5] | [2, 3, 4] | [2, 3, 5] | [2, 4, 5] | [3, 4, 5] |
  [1, 2, 3, 4] | [1, 2, 3, 5] | [1, 2, 4, 5] | [1, 3, 4, 5] | [2, 3, 4, 5] |
  [1, 2, 3, 4, 5] >>,
  Expect<Equal<Subsequence<['a', 'b', 'c']>, [] |
  ['a'] | ['b'] | ['c'] |
  ['a', 'b'] | ['a', 'c'] | ['b', 'c'] |
  ['a', 'b', 'c'] >>,
  Expect<Equal<Subsequence<['x', 'y']>, [] |
  ['x'] | ['y'] |
  ['x', 'y'] >>,
]
```

### 문제분석

집합의 부분집합을 모두 구하는 것이다



원소별로 존재하는지 안존재하는지 두가지 경우가 n개 존재한다



### 첫번째 접근 - 정답

```ts
type Subsequence<T extends any[], Result extends any[] = []> =
  T extends [infer First, ...infer Rest]
    ? Rest extends any[]
      ? Subsequence<Rest, [...Result, First] | Result >
      : never
    :Result
```

이전 combination에서 이 개념으로 시도했던 적이 있어서 그대로 구현했다.

원소를 하나씩 분리한다음에 기존 집합과 기존 집합에 분리된 원소를 더한걸 유니언으로 만든 답을 넣어 재귀하는 것을 반복했다.



이 경우 기존의 result는 해당 원소가 안들어간 경우 [...Result, First]는 이 원소가 들어간 경우로 나뉘고 나뉜채로 재귀가 되기 때문에 모든 경우의 수가 result에 유니언으로 포함이 된다.



## CheckRepeatedChars

Implement type `CheckRepeatedChars<S>` which will return whether type `S` contains duplicated chars?

For example:

```ts
type CheckRepeatedChars<'abc'>   // false
type CheckRepeatedChars<'aba'>   // true
```

```ts
type cases = [
  Expect<Equal<CheckRepeatedChars<'abc'>, false>>,
  Expect<Equal<CheckRepeatedChars<'abb'>, true>>,
  Expect<Equal<CheckRepeatedChars<'cbc'>, true>>,
  Expect<Equal<CheckRepeatedChars<''>, false>>,
]
```



### 문제 분석

문자열중에 반복되는 문자열이 있는 경우에 따라 참 거짓을 반환한다.



### 첫번째 접근 - 정답

```ts
type CheckRepeatedChars<T extends string> = 
  T extends `${infer First}${infer Rest}`
    ? Rest extends `${infer _}${First}${infer _}`
      ? true
      : CheckRepeatedChars<Rest>
    : false

```

가장 쉽게 생각이 난 것은 하나씩 떼고 뒤에 있는지 따진 후에 남은 값들로 재귀를 돌리는 것이었다.

이때 문자열 하나를 떼고 뒷부분에 그 문자열이 있는지 확인하는 작업을 처음에는 단순히 다 체크하려 했다.

하지만 그 대신 infer를 이용했다. 해당 근제를 넣고 앞뒤에 infer를 넣어서 이 문자열이 extends 가 되는지 여부로 해당 로직을 구성했다.



## FirstUniqueCharIndex

Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

```ts
type cases = [
  Expect<Equal<FirstUniqueCharIndex<'leetcode'>, 0>>,
  Expect<Equal<FirstUniqueCharIndex<'loveleetcode'>, 2>>,
  Expect<Equal<FirstUniqueCharIndex<'aabb'>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<''>, -1>>,
  Expect<Equal<FirstUniqueCharIndex<'aaa'>, -1>>,
]
```

### 문제 분석

문자열에서 처음으로 혼자 존재하는 문자의 인덱스를 출력하는 유틸리티 함수이다



### 첫번째 접근

앞서 풀이한 CheckRepeatedChar와 같은 방식으로 접근했다

```ts
type FirstUniqueCharIndex<T extends string, IndexArray extends Array<any> = []> = 
  T extends `${infer First}${infer Rest}`
    ? Rest extends `${infer _}${First}${infer _}`
      ? FirstUniqueCharIndex<Rest, [...IndexArray, any]>
      : IndexArray['length']
    : -1
```

문자열을 하나씩 뺀 다음에 뒤에 있는 문자열중에 해당 문자가 들어있는지 infer를 통해 확인했다.

그래서 infer문이 extends 되지 않을 때, 즉 뒤에 해당 문자가 없을 때 array를 통해 1씩 증가시킨 index를 출력하도록 하였다



이 때 문제가 Rest에서 겹친것 찾기 때문에 앞에 있는 문자가 repeated 되는 경우 이걸 체크하지 못하고 unique한 것으로 판단해버렸다



### 두번째 접근 - 정답

```ts
type FirstUniqueCharIndex<
  T extends string, 
  IndexArray extends Array<any> = [], 
  PrevString extends string = ""
> 
  = T extends `${infer First}${infer Rest}`
    ? `${PrevString}${Rest}` extends `${infer _}${First}${infer _}`
      ? FirstUniqueCharIndex<Rest, [...IndexArray, any], `${PrevString}${First}`>
      : IndexArray['length']
    : -1
```

그래서 간단한 방식으로 접근했다.

문자열 제네릭을 하나더 추가해서 앞에서 체크한 애들도 저장을 해준후 뒤에 남은 문자열과 앞서 체크한 문자열이 쌓여있는 문자까지 템플릿 리터럴로 함쳐 체크했다.

결과적으로 문자 하나씩 검사를 하면서 앞뒤 문자열을 템플릿 리터럴로 함친 문자열에 infer로 포함이 되어있는지 하나씩 체크하는 방식이 되었다.



## ParseUrlParams

You're required to implement a type-level parser to parse URL params string into an Union.

```ts
ParseUrlParams<':id'> // id
ParseUrlParams<'posts/:id'> // id
ParseUrlParams<'posts/:id/:user'> // id | user
```

```ts
type cases = [
  Expect<Equal<ParseUrlParams<''>, never>>,
  Expect<Equal<ParseUrlParams<':id'>, 'id'>>,
  Expect<Equal<ParseUrlParams<'posts/:id'>, 'id'>>,
  Expect<Equal<ParseUrlParams<'posts/:id/'>, 'id'>>,
  Expect<Equal<ParseUrlParams<'posts/:id/:user'>, 'id' | 'user'>>,
  Expect<Equal<ParseUrlParams<'posts/:id/:user/like'>, 'id' | 'user'>>,
]
```

### 문제 분석

url의 파라미터를 분해해서 유니온 타입으로 반환한다.

`:`뒤에 있으며 `/`로 구분된 문자열을 분리하면 된다.



### 첫번째 접근 - 정답

```ts
type ParseUrlParams<
  T, 
  Temp extends string = "", 
  Result extends string = never,
  IsParam extends boolean = false,
> =
  T extends `${infer First}${infer Rest}`
    ? First extends '/'
      ? ParseUrlParams<Rest, "", Result | (Temp extends "" ? never : Temp), false>
      : IsParam extends true
        ? ParseUrlParams<Rest, `${Temp}${First}`, Result, true>
        : First extends ':'
          ? ParseUrlParams<Rest, "", Result, true>
          : ParseUrlParams<Rest, "", Result, false>
    : Result | (Temp extends "" ? never : Temp)
```



제네릭으로는 임시 문자열과 결과 저장하는 문자 유니언 타입, 현재 파라미터 문자열 영역에 있는지 판단하는 플래그 타입 하나를 지정했다

그리고 경우의수 로직을 이렇게 구성했다

`/`문자열인 경우 -> 현재 temp에 저장중인 문자열을 결과에 유니언 함수로 추가, 플래그는 false로 전환

플래그가 true인 경우 -> temp로 저장된 문자열에 현재 First로 분리한 문자열을 추가, 플래그는 true 유지

`:`문자열인 경우 -> 플래그를 true로 전환해서 이후 문자열들이 temp에 저장될 수 있도록 재귀

위 경우에 해당하지 않는 경우 -> 플래그는 false로 저장하며 temp는 무관, Result도 유지한다



## Get Middle Element

Get the middle element of the array by implementing a `GetMiddleElement` method, represented by an array

> If the length of the array is odd, return the middle element If the length of the array is even, return the middle two elements

For example

```ts
  type simple1 = GetMiddleElement<[1, 2, 3, 4, 5]>, // expected to be [3]
  type simple2 = GetMiddleElement<[1, 2, 3, 4, 5, 6]> // expected to be [3, 4]
```

```ts
type cases = [
  Expect<Equal<GetMiddleElement<[]>, []>>,
  Expect<Equal<GetMiddleElement<[1, 2, 3, 4, 5]>, [3]>>,
  Expect<Equal<GetMiddleElement<[1, 2, 3, 4, 5, 6]>, [3, 4]>>,
  Expect<Equal<GetMiddleElement<[() => string]>, [() => string]>>,
  Expect<Equal<GetMiddleElement<[() => number, '3', [3, 4], 5]>, ['3', [3, 4]]>>,
  Expect<Equal<GetMiddleElement<[() => string, () => number]>, [() => string, () => number]>>,
  Expect<Equal<GetMiddleElement<[never]>, [never]>>,
]
```



### 문제 분석

배열 타입을 받아 중간에 있는 값을 반환한다.

이 때 배열의 길이가 짝수일 경우 가운데 두개의 원소를 반환한다



### 첫번째 접근

```ts
type GetMiddleElement<T> = 
  T extends [infer _, ...infer Rest, infer _]
    ? GetMiddleElement<Rest>
    : T
```

첫값과 마지막값을 빼면서 재귀를 돌렸다

이때 배열의 길이가 짝수인경우 그냥 둘다 빼버리고 공백으로 반환하는 케이스가 있었다



### 두번째 접근 - 정답

이 경우를 처리하기 위해 두가지 방법을 생각했는데 둘다 됐다

```ts
type GetMiddleElement<T> = 
  T extends [infer Head, ...infer Rest, infer Tail]
    ? Rest extends []
      ? [Head, Tail]
      : GetMiddleElement<Rest>
    : T
```

Rest가 공백인 경우 앞뒤 애들을 다시 가져와서 반환하는 방법을 사용했다



```ts
type GetMiddleElement<T extends Array<any>> = 
  T['length'] extends 2
  ? T
  : T extends [infer _, ...infer Rest, infer _]
    ? GetMiddleElement<Rest>
    : T
```

좀더 간단하게 T의 길이가 2인경우 재귀를 진행하지 않고 그냥 반환해버렸다

