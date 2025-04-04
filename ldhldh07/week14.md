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