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



### 첫번째 접근

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
