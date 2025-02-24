# week8

## Percentage Parser

PercentageParser을 구현하세요. `/^(\+|\-)?(\d*)?(\%)?$/` 정규식에 따라 T를 일치시키고 3개의 일치 요소를 얻습니다 구조는 [`더하기 혹은 빼기`, `숫자`,`단위`]와 같아야 합니다. 일치 요소가 없다면, 기본값은 빈 문자열입니다.

예시:

```ts
type PString1 = ""
type PString2 = "+85%"
type PString3 = "-85%"
type PString4 = "85%"
type PString5 = "85"

type R1 = PercentageParser<PString1> // expected ['', '', '']
type R2 = PercentageParser<PString2> // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3> // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4> // expected ["", "85", "%"]
type R5 = PercentageParser<PString5> // expected ["", "85", ""]
```

```ts
type cases = [
  Expect<Equal<PercentageParser<''>, Case0>>,
  Expect<Equal<PercentageParser<'+'>, Case1>>,
  Expect<Equal<PercentageParser<'+1'>, Case2>>,
  Expect<Equal<PercentageParser<'+100'>, Case3>>,
  Expect<Equal<PercentageParser<'+100%'>, Case4>>,
  Expect<Equal<PercentageParser<'100%'>, Case5>>,
  Expect<Equal<PercentageParser<'-100%'>, Case6>>,
  Expect<Equal<PercentageParser<'-100'>, Case7>>,
  Expect<Equal<PercentageParser<'-1'>, Case8>>,
  Expect<Equal<PercentageParser<'%'>, Case9>>,
  Expect<Equal<PercentageParser<'1'>, Case10>>,
  Expect<Equal<PercentageParser<'100'>, Case11>>,
]

```



### 정답

```ts
type PercentageParser<A extends string> = 
  A extends `${infer First}${infer Rest}` 
    ? First extends ('+' | '-') 
      ? Rest extends `${infer Middle}%` 
        ? [First, Middle, '%']
        : [First, Rest, '']
      : A extends `${infer Middle}%`
        ? ['', Middle, '%']
        : A extends ''
          ? ['', '', '']
          : ['', A, '']
    : ['','','']
```

경우의 수로 풀었다



## Drop Char

Drop a specified char from a string.

For example:

```ts
type Butterfly = DropChar<' b u t t e r f l y ! ', ' '> // 'butterfly!'
```

```ts
type cases = [
  // @ts-expect-error
  Expect<Equal<DropChar<'butter fly!', ''>, 'butterfly!'>>,
  Expect<Equal<DropChar<'butter fly!', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<'butter fly!', '!'>, 'butter fly'>>,
  Expect<Equal<DropChar<'    butter fly!        ', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', ' '>, 'butterfly!'>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', 'b'>, '  u t t e r f l y ! '>>,
  Expect<Equal<DropChar<' b u t t e r f l y ! ', 't'>, ' b u   e r f l y ! '>>,
]
```



### 정답

```ts
type DropChar<S, C> = 
  S extends `${infer First}${infer Rest}`
    ? First extends C
      ? DropChar<Rest, C>
      : `${First}${DropChar<Rest, C>}`
    : ''
```

하나씩 체크하고 C일 경우 빼고 재귀하는 방식으로 해결했다.



## MinusOne

Given a number (always positive) as a type. Your type should return the number decreased by one.

For example:

```ts
type Zero = MinusOne<1> // 0
type FiftyFour = MinusOne<55> // 54
```



### 첫번째 접근

숫자 계산에 대해서 힌트만 받으려고 알아보니 `['length']`를 이용한 방법이 있었다

```ts
type MinusOne<T extends number, B extends Array<any>= []> = 
  B['length'] extends T 
    ? B extends [infer _One, ...infer Rest]
      ? Rest['length']
      : 0
    : MinusOne<T, [0, ...B]>
```

하지만 이 경우 1000부터는 재귀 횟수 제한이 있는지 안됐다

그래서 1의 자리수만 가지고 하고자 했다



### 두번째 접근

```ts
type MinusOne<T extends number, LastNumber extends string = `${T}`, RestNumber extends string = "", B extends any[] = []> =
  LastNumber extends `${infer First}${infer Rest}`
    ? Rest extends "" 
      ? `${B['length']}` extends LastNumber 
        ? B extends [infer _One, ...infer Rest] 
          ? `${RestNumber}${Rest['length']}`
          : 0
        : MinusOne<T, LastNumber, RestNumber, [0, ...B]> 
      : MinusOne<T, Rest, `${RestNumber}${First}`, [0, ...B]> 
    : never;
```

그래서 T를 마지막 하나와 앞에 부분으로 분리한 다음에 마지막 부분에면 마이너스1을 하고 나중에 앞에 부분을 합쳐줬다

그런데 문제가 그러면 최종 답이 문자열이 되어버린다



### 세번째 접근

```ts
type MinusOne<T extends number, LastNumber extends string = `${T}`, RestNumber extends string = "", B extends any[] = []> =
  LastNumber extends `${infer First}${infer Rest}`
    ? Rest extends "" 
      ? `${B['length']}` extends LastNumber 
        ? B extends [infer _One, ...infer Rest] 
          ? `${RestNumber}${Rest['length']}` extends `${infer N extends number}` 
            ? N 
            : never
          : 0
        : MinusOne<T, LastNumber, RestNumber, [0, ...B]> 
      : MinusOne<T, Rest, `${RestNumber}${First}`, [0, ...B]> 
    : never;
```

#### 문자를 숫자로 바꾸는 방식

```ts
type ToNumber<S extends string> = S extends `${infer N extends number}` ? N : never;
```

이런방식이 있었다

근데 이렇게 해도 0의 처리 문제나 숫자가 큰 마지막 두개의 케이스는 안됐다



### 정답 확인

정답을 확인해봤는데 자세히 이해할 필요는 없어보여서 그냥 읽어만 봤다



## PickByType

From `T`, pick a set of properties whose type are assignable to `U`.

For Example

```ts
type OnlyBoolean = PickByType<{
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}, boolean> // { isReadonly: boolean; isEnable: boolean; }
```

```ts
interface Model {
  name: string
  count: number
  isReadonly: boolean
  isEnable: boolean
}

type cases = [
  Expect<Equal<PickByType<Model, boolean>, { isReadonly: boolean, isEnable: boolean }>>,
  Expect<Equal<PickByType<Model, string>, { name: string }>>,
  Expect<Equal<PickByType<Model, number>, { count: number }>>,
]

```

### 문제 분석

객체 타입에서 값이 U에 해당하는 값들만 필터링해서 객체로 모아 반환한다

### 첫번째 접근 - 정답

```ts
type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P] 
}
```

as의 일반적인 사용을 통해 정답을 작성했다.



## StartsWith

Implement `StartsWith<T, U>` which takes two exact string types and returns whether `T` starts with `U`

For example

```ts
type a = StartsWith<'abc', 'ac'> // expected to be false
type b = StartsWith<'abc', 'ab'> // expected to be true
type c = StartsWith<'abc', 'abcd'> // expected to be false
```

```ts
type cases = [
  Expect<Equal<StartsWith<'abc', 'ac'>, false>>,
  Expect<Equal<StartsWith<'abc', 'ab'>, true>>,
  Expect<Equal<StartsWith<'abc', 'abc'>, true>>,
  Expect<Equal<StartsWith<'abc', 'abcd'>, false>>,
  Expect<Equal<StartsWith<'abc', ''>, true>>,
  Expect<Equal<StartsWith<'abc', ' '>, false>>,
  Expect<Equal<StartsWith<'', ''>, true>>,
]
```

### 문제분석

문자열 T, U가 있을 때 T의 앞부분이 U의 문자열로 이루어질 때 true를 반환한다. 



### 첫번째 접근 - 정답

```ts
type StartsWith<T extends string, U extends string> = 
  U extends `${infer FirstOfU}${infer RestOfU}` 
    ? T extends `${infer FirstOfT}${infer RestOfT}`
      ? FirstOfU extends FirstOfT
        ? StartsWith<RestOfT, RestOfU>
        : false
      : false
    : true
```

U랑 T를 돌면서 비교해서 맞으면 재귀로 다음 단어 비교하는 방식

T의 순회가 먼저 끝나면 false U의 순회가 끝나면 true



## EndsWith

Implement `EndsWith<T, U>` which takes two exact string types and returns whether `T` ends with `U`

For example:

```ts
type a = EndsWith<'abc', 'bc'> // expected to be true
type b = EndsWith<'abc', 'abc'> // expected to be true
type c = EndsWith<'abc', 'd'> // expected to be false
```

```ts
type cases = [
  Expect<Equal<EndsWith<'abc', 'bc'>, true>>,
  Expect<Equal<EndsWith<'abc', 'abc'>, true>>,
  Expect<Equal<EndsWith<'abc', 'd'>, false>>,
  Expect<Equal<EndsWith<'abc', 'ac'>, false>>,
  Expect<Equal<EndsWith<'abc', ''>, true>>,
  Expect<Equal<EndsWith<'abc', ' '>, false>>,
]
```

### 문제 분석

문자열 T, U가 있을떄 U가 T 문자열의 뒷 부분에 포함되면 true를 아니면 false를 반환한다.

### 첫번째 접근 - 정답

```ts
type EndsWith<T extends string, U extends string> =
  T extends U
    ? true
    : T extends `${infer _First}${infer Rest}`
      ? Rest extends U
        ? true
        : EndsWith<Rest, U>
    :  false
```

뒷부분은 어차피 infer로 통째로 떼어지기 때문에 그 크기를 하나씩 줄여가면서 extends로 U랑 평가한다.