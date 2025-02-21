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