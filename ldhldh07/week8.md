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