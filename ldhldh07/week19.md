# week19

## IsFixedStringLiteralType

Sometimes you may want to determine whether a string literal is a definite type. For example, when you want to check whether the type specified as a class identifier is a fixed string literal type.

```
type Action<ID extends string> = { readonly id: ID };
```



Since it must be fixed, the following types must be determined as false.

- never type
- Union of string literal types
- Template literal types with embedded string, number, bigint, boolean

Determine whether the given type S is a definite string literal type.

```ts
type testcase =
  | Expect<Equal<IsFixedStringLiteralType<'ABC'>, true>>
  | Expect<Equal<IsFixedStringLiteralType<string>, false>>
  | Expect<Equal<IsFixedStringLiteralType<'ABC' | 'DEF'>, false>>
  | Expect<Equal<IsFixedStringLiteralType<never>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string & {}}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${number}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${bigint}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${boolean}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${true}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${false}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${null}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${undefined}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string & {}}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${number}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${bigint}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${boolean}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${true}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${false}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${null}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${undefined}`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${string}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string & {}}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${number}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${bigint}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${boolean}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${true}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${false}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${null}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`${undefined}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${string & {}}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${number}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${bigint}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${boolean}DEF`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${true}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${false}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${null}DEF`>, true>>
  | Expect<Equal<IsFixedStringLiteralType<`ABC${undefined}DEF`>, true>>
  | true

```

### 문제 분석

문자열인데 fixed타입인지 판단해서 true/false로 반환하는 유틸리티 타입이다



### 첫번째 접근

일단 케이스 하나씩 해결하는 느낌으로 풀이하였다.

```ts
type IsFixedStringLiteralType<S extends string> =
  string extends S
    ? false
    : true
```

먼저 string타입인 경우를 구분해주었다.

```ts
type IsUnion<T, U = T> =  
  [T] extends [never]
    ? false
    : T extends T 
        ? [U] extends [T] 
          ? false 
          : true
        : false

type IsFixedStringLiteralType<S extends string> =
  IsUnion<S> extends true
    ? false
    : string extends S
      ? false
      : true
```

그 전에 union타입인 경우를 해결해주었다.

isUnion은 이전에 풀이했던 유틸리티 타입이라 가져와서 사용하였다.

```ts
type IsUnion<T, U = T> =  
  T extends T 
    ? [U] extends [T] 
      ? false 
      : true
    : false

type IsFixedStringLiteralType<S extends string> =
  [S] extends [never]
    ? false
    : IsUnion<S> extends true
      ? false
      : string extends S
        ? false
        : true
```

never도 처리해줬다.



하지만 

```ts
  | Expect<Equal<IsFixedStringLiteralType<`${string}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${string & {}}`>, false>>
  | Expect<Equal<IsFixedStringLiteralType<`${number}`>, false>>
```

해당 케이스들의 처리가 어려웠다.



#### {} extends Record<S, 1>

답을 찾아보니 이런식으로 대부분의 케이스들을 해결했다.

Record<S,1>에서는 리터럴 타입이 아닌 경우, 그중에서도 가능성이 무한한 타입은 키값이 optional하게 작동한다

```ts
Record<`ABC${string & {}}`, 1>
// {
//     [x: `ABC${string & {}}`]: 1;
// }
Record<'ABC', 1>
// {
//    ABC: 1;
// }
```

그리고 optional한 키를 가진 객체의 경우  `{} extends Record<S, 1>`를 true로 반환한다.

다만 boolean이 포함되거나 유니언 타입은 무한하지 않기 때문에 이 방법으로 걸러지지 않는다.

```ts
Record<`${boolean}`, 1>
// {
//     false: 1;
//     true: 1;
// }
Record<'ABC' | 'DEF', 1>
// {
//     ABC: 1;
//     DEF: 1;
// }
```



### 정답

```ts
type IsUnion<T, U = T> =  
  T extends T 
    ? [U] extends [T] 
      ? false 
      : true
    : false

type IsFixedStringLiteralType<S extends string> = 
  {} extends Record<S, 1> 
    ? false 
    : IsUnion<S> extends true
      ? false
      : true
```

그래서 이전에 사용했던 isUnion으로 해결할 수 있다.



참고했던 답에선 isUnion을 다른식으로 하기도 했다.

```ts
type IsFixedStringLiteralType<S extends string> = 
  {} extends Record<S, 1> 
    ? false 
    : Equal<[S], S extends unknown ? [S] : never>
```

그걸 이용해서 [] 배열 타입에 분배법칙으로 타입들을 넣고 유니언이 아닐때만 단일 배열 안에 원소가 들어가는 같은 형태인것을 이용한 것이다.



## Compare Array Length

Implement `CompareArrayLength` to compare two array length(T & U).

If length of T array is greater than U, return 1; If length of U array is greater than T, return -1; If length of T array is equal to U, return 0.

```ts
type cases = [
  Expect<Equal<CompareArrayLength<[1, 2, 3, 4], [5, 6]>, 1>>,
  Expect<Equal<CompareArrayLength<[1, 2], [3, 4, 5, 6]>, -1>>,
  Expect<Equal<CompareArrayLength<[], []>, 0>>,
  Expect<Equal<CompareArrayLength<[1, 2, 3], [4, 5, 6]>, 0>>,
]
```

### 문제 분석

두개의 배열의 길이를 비교한다, T가 길면 1, U가 길면 -1, 똑같으면 0을 반환한다.



### 첫번째 접근 - 정답

```	ts
type CompareArrayLength<T extends any[], U extends any[]> =
  T extends []
    ? U extends []
      ? 0
      : -1
    : U extends []
      ? 1
      : CompareArrayLength<T extends [infer _, ...infer TRest] ? TRest : never, U extends [infer _, ...infer URest] ? URest : never>

```



T와 U를 하나씩 원소 빼가면서 비교한다.

먼저 비었다는건 더 짧다는 원리를 사용했다.

4가지 경우로 T가 비었고 U가 안비었을 때는 1을 반환하고, U가 안비었고 T가 비었을때는 -1, 둘 다 비었을 때는 0을 반환한다.

둘 다 안비었을 때는 재귀로 하나 뺀 배열들로 돌린다.



## Defined Partial Record 

Using a Record with union types as keys doesn't allow you to make an object with only some of them

```ts
const record: Record<'a' | 'b' | 'c', number> = { a: 42, b: 10 } 
// error: Property 'c' is missing in type '{ a: number; b: number; }' 
// but required in type 'Record<"a" | "b" | "c", number>'
```



Using a Partial Record with union types as keys allows you to make an object without all union members, but makes all keys and values optional, potentially leaving them undefined

```ts
const partial: Partial<Record<'a' | 'b' | 'c', number>> = { a: 42 } 
const partialType = typeof partial // { a?: number | undefined, b? : number | undefined, c? : number | undefined }
const operation = 0 + partial.a // error: 'partial.a' is possibly 'undefined'
const access = partial.c // possible, type doesn't know that there is no such key
```



You need to make a type that takes the best of both worlds, creates all combinations of all the types in the union, so using a key that exists in the object gives you a defined type, but using a key that exists in the union and not in the object throws an error

```ts
const best: DefinedPartial<Record<'a' | 'b' | 'c', number>> = { a: 42 } 
const sum = 0 + best.a // 42
const error = best.b // error: property 'b' does not exist on type '{ a: number; }'
```

```ts
type A1 = Record<'a' | 'b', string>
type E1 = { a: string } |
  { b: string } |
  { a: string, b: string }
type D1 = DefinedPartial<A1>
type C1 = Expect<Equal<D1, E1>>

type A2 = Record<'a' | 'b' | 'c', string>
type E2 = { a: string } |
  { b: string } |
  { c: string } |
  { a: string, b: string } |
  { a: string, c: string } |
  { b: string, c: string } |
  { a: string, b: string, c: string }
type D2 = DefinedPartial<A2>
type C2 = Expect<Equal<D2, E2>>

type A3 = Record<'a', number>
type E3 = { a: number }
type D3 = DefinedPartial<A3>
type C3 = Expect<Equal<D3, E3>>

type A4 = Record<'a', number>
type E4 = { a: string }
type D4 = DefinedPartial<A4>
type C4 = ExpectTrue<NotAny<D4> | NotEqual<D4, E4>>

type A5 = Record<'a' | 'c', number>
type E5 = { a: string, b: string }
type D5 = DefinedPartial<A5>
type C5 = ExpectTrue<NotAny<D5> | NotEqual<D5, E5>>

type A6 = { a: string, b: string }
type E6 = { a: string } |
  { b: string } |
  { a: string, b: string }
type D6 = DefinedPartial<A6>
type C6 = Expect<Equal<D6, E6>>

```

### 문제 분석

키값을 유니언으로 받으면 해당 값들이 키값으로 나뉘어진 객체가 된다. 그 객체를 제네릭으로 넣었을때 키값들의 경우의 수가 나뉘어 유니언으로 이뤄진 타입을 반환



### 첫번째 접근

```ts
type DefinedPartial<T, KeyOfT = keyof T> =
  KeyOfT extends unknown
    ? {KeyOfT: T[KeyOfT extends keyof T ? KeyOfT : never]} | DefinedPartial<T, Exclude<keyof T, KeyOfT>>
    : never
```

이전 combination관련 문제들을 참고했다.

이 경우 keyof T가 분배가 되는 것이 아니라 동적이 키가 된다고 한다.



### 두번째 접근 - 정답

```ts
type DefinedPartial<T, KeyOfT extends keyof T = keyof T> = 
  KeyOfT extends unknown
    ? T | DefinedPartial<Omit<T, KeyOfT>>
    : never;
```

보다 단순한 형태가 답이었다.

T의 키값을 분배법칙으로 돌린다음에 해당 키가 제외되는 Omit을 이용해서 조합의 로직에 해당되는 재귀를 돌릴 수 있다.



## Longest common prefix

Write a type, `LongestCommonPrefix` that returns the longest common prefix string amongst a tuple of strings.

If there is no common prefix, return an empty string `""`.

```ts
type Common = LongestCommonPrefix<["flower", "flow", "flight"]>
//   ?^ "fl"

type Uncommon = LongestCommonPrefix<["dog", "racecar", "race"]>
//   ?^ ""
```

```ts
type cases = [
  Expect<Equal<LongestCommonPrefix<['flower', 'flow', 'flight']>, 'fl'>>,
  Expect<Equal<LongestCommonPrefix<['dog', 'racecar', 'race']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', '', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', '', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', 'a', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', '', 'a']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', 'a', '']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', '', 'a']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['', 'a', 'a']>, ''>>,
  Expect<Equal<LongestCommonPrefix<['a', 'a', 'a']>, 'a'>>,
  Expect<Equal<LongestCommonPrefix<['abc', 'abcd', 'abcde']>, 'abc'>>,
  Expect<Equal<LongestCommonPrefix<[' ', ' ', ' ']>, ' '>>,
  Expect<Equal<LongestCommonPrefix<['type-challenges', 'type-hero', 'typescript']>, 'type'>>,
]

```

### 문제분석

앞에서부터 겹치는 단어를 추출해서 가장 긴 공통 prefix를 반환한다.



### 첫번째 접근

```ts
type LongestCommonPrefix<T extends string[], P extends string = ''>
  = T extends [`${P}${infer First}${string}`, ...infer Rest extends string[]]
    ? LongestCommonPrefix<Rest, `${P}${First}`>
    : P
```

T의 첫번째에서 현재까지 구한 공통 prefix를 제외한 첫번째 단어를 추출한다

이 경우 앞에서부터 순서대로 일치하기만 해도 뒤 배열로 넘어가는 방식이라 틀렸다



### 두번째 접근

```ts
type IsCommonPrefix<T extends string, U extends string[]>
 = U extends [infer First, ...infer Rest extends string[]]
  ? First extends `${T}${string}`
    ? IsCommonPrefix<T, Rest>
    : false
  : true

type LongestCommonPrefix<T extends string[], P extends string = ''>
  = T extends [`${P}${infer First}${string}`, ...infer Rest extends string[]]
    ? IsCommonPrefix<`${P}${First}`, Rest> extends true
      ? LongestCommonPrefix<T, `${P}${First}`>
      : P
    : P
```

First를 가져온 후 해당 단어가 뒤의 배열에 다 일치하는지 확인하고 확인 됐을 때만 이를 공통 prefix로 넘겼다.



## Trace

The trace of a square matrix is the sum of the elements on its main diagonal. However, it's difficult to calculate the sum with type system. To make things simple, let's return the elements on the main diagonal with union type.

For example:

```ts
type Arr = [
  [1,2],
  [3,4]
]
type Test = Trace<Arr> // expected to be 1 | 4
```

```ts
type cases = [
  Expect<Equal<Trace<[[1, 2], [3, 4]]>, 1 | 4>>,
  Expect<Equal<Trace<[[0, 1, 1], [2, 0, 2], [3, 3, 0]]>, 0>>,
  Expect<Equal<Trace<[['a', 'b', ''], ['c', '', ''], ['d', 'e', 'f']]>, 'a' | '' | 'f'>>,
]
```



### 문제 분석

2차원 행렬 배열에서 대각선에 위치해있는 원소들을 유니언 타입으로 반환한다.



### 첫번째 접근 - 정답

```ts
type Trace<T extends any[][], IndexArray extends any[] = []> = 
  IndexArray['length'] extends T['length']
    ? never
    : T[IndexArray['length']][IndexArray['length']] | Trace<T, [...IndexArray, any]>
```

숫자를 행렬의 크기만큼 가면서 해당 숫자를 두번 탐색하는 식으로 했다.



### 더 나은 정답

```ts
type Trace<T extends any[][]> = 
  {[P in keyof T]: T[P][P]}[number]
```

이런식의 방향성으로 풀이를 풀고 싶었는데

P가 P안에서 탐색되는지에 대한 불명확함에서 오는 에러가 났다.

```ts
type Trace<T extends any[][]> = 
  {[P in keyof T]: T[P] extends infer A ? A extends {[K in P]: any} ? A[P] : never : never}[number]
```

그래서 infer로 T[P]를 P를 포함한 객체로 추론해서 해당 에러를 없엤다.



## IsAlphabet

Determine if the given letter is an alphabet.

```ts
type cases = [
  Expect<Equal<IsAlphabet<'A'>, true>>,
  Expect<Equal<IsAlphabet<'z'>, true>>,
  Expect<Equal<IsAlphabet<'9'>, false>>,
  Expect<Equal<IsAlphabet<'!'>, false>>,
  Expect<Equal<IsAlphabet<'😂'>, false>>,
  Expect<Equal<IsAlphabet<''>, false>>,
]
```


### 문제분석

알파벳일 경우 true 아닌경우 false를 했다.



### 첫번째 접근 - 정답

```ts
type IsAlphabet<S extends string> = 
  S extends 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' 
          | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' 
          | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' 
          | 'V' | 'W' | 'X' | 'Y' | 'Z' | 'a' | 'b'
          | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i'
          | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p'
          | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w'
          | 'x' | 'y' | 'z'
    ? true
    : false
```

그냥 다 걸어줬다.

뭔가 특별한 풀이가 있다 싶어서 봤는데 LowerCase, Uppercase를 이용한 답이었다.
