# Week 18

## [Medium-28333-PublicType](./medium/28333-public-type.ts)

```ts
type PublicType<T extends object> = {
  [K in keyof T as K extends `_${any}` ? never : K]: T[K];
};
```

- key가 `_`로 시작하는 경우 제외하고 나머지만을 반환하는 형태,
- `as`를 통해 K를 다시 검증하는 방식을 이용할 수 있고, K를 문자열 템플릿 패턴매칭을 통해 조건을 파악할 수 있다
- `_`로 시작하는 경우 `never`를 이용하여 반환되는 객체에 포함되지 않도록 한다.

## [Medium-29650-ExtractToObject](./medium/29650-extract-to-object.ts)

```ts
type Merge<T> = {
  [K in keyof T]: T[K];
};

type ExtractToObject<T, U extends keyof T> = Merge<Omit<T, U> & T[U]>;
```

- 예제에 따라 T의 key가 아닌 것이 U에 들어오면 에러 표기가 되어야 하기 때문에 `U extends keyof T`를 이용
- T에서 먼저 U를 제거하고, T[U]를 통해 객체를 얻고, 이를 Intersection한 후, Merge 헬퍼 타입으로 하나의 객체 타입으로 변환한다

## [Medium-29785-DeepOmit](./medium/29785-deep-omit.ts)

```ts
type DeepOmit<T, DeepKey extends string> = DeepKey extends keyof T
  ? Omit<T, DeepKey>
  : DeepKey extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? {
        [P in keyof T]: P extends K ? DeepOmit<T[P], Rest> : T[P];
      }
    : T
  : T;
```

- 먼저 DeepKey가 .으로 구분될 필요 없이 `keyof T`를 만족한다면, `Omit`을 통해 제외한다.
- 이후 문자열 패턴 매칭을 통해 앞에서부터 keyof T를 만족하는 K라면 나머지 Rest에 대해 만족하는 해당 K에 대해서는 재귀를 진행하고, 나머지는 그대로 값을 취한다.
- 패턴 매칭에 만족하지 않는 K라면 그대로 반환하는 방식을 취한다.

## [Medium-30301-isOdd](./medium/30301-is-odd.ts)

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

type IsOdd<T extends number> =
  Equal<T, number> extends true
    ? false
  : `${T}` extends `${infer N extends number}e${infer E extends number}`
    ? E extends 0
      ? IsOdd<N>
      : false
  : `${T}` extends `${string}.${string}`
    ? false
  : `${T}` extends `${infer _Prefix}${1|3|5|7|9}`
    ? true
    : false;
```

- 보다 정교하게 만들려면 소수 + 지수표기법까지 고려해야 했을 듯 했지만 예시 케이스들만을 기준으로 했다
- `number` 타입이 주어진다면 Equal을 이용하여 제외
- 지수 표기법으로 나타나는 경우 지수부가 0이라면 앞부분 숫자만을 재귀를 진행하여 홀수임을 판별
- 소수 형태라면 false로 처리하고,
- 모두 아닌 경우에 문자열 패턴 매칭으로 전환하여 마지막 자리가 1, 3, 5, 7, 9와 매칭되는 경우만을 true로 판별

## [Medium-30430-TowerOfHanoi](./medium/30430-tower-of-hanoi.ts)

```ts
type CreateTuple<N extends number, R extends unknown[] = []> = R['length'] extends N ? R : CreateTuple<N, [...R, unknown]>

type Prev<N extends number> = CreateTuple<N> extends [...infer Rest, unknown] ? Rest['length'] : never;

type Hanoi<N extends number, From = 'A', To = 'B', Intermediate = 'C'> = N extends 0 ? [] : [
  ...Hanoi<Prev<N>, From, Intermediate, To>,
  [From, To],
  ...Hanoi<Prev<N>, Intermediate, To, From>
]
```

- `CreateTuple`을 통해 수의 길이만큼 배열을 생성, `Prev`는 이용하여 수를 1 감소시키는 헬퍼 타입
- N개의 원판을 From에서 To로 옮기는 과정을 다음과 같이 나눈다
  - N-1개의 원판을 From에서 Intermediate로 이동
  - 가장 큰 원판을 From에서 To로 이동 ([From, To])
  - N-1개의 원판을 Intermediate에서 To로 이동
- N이 0이 되면 빈 배열을 반환하여 재귀를 종료하고, 매 단계마다 이동 경로를 튜플 형태로 반환하여 최종적으로 모든 이동 단계를 배열 형태로 표현


## [Medium-30958-Pascal'sTriangle](./medium/30958-pascal's-triangle.ts)

```ts
type IdxNext<Arr extends 0[][] = [],  Head extends 0[][] = [[0]] > =
  Arr extends [ infer A extends 0[], infer B extends 0[], ...infer Rest extends 0[][] ]
    ? [ ...Head, [ ...A, ...B ], ...IdxNext<[B, ...Rest], []> ]
    : Arr extends []
      ? []
      : [ ...Head, [0] ]

type IdxNextByNumber<N extends number, Counter extends 0[] = [], Last extends 0[][] = [[0]]> =
  N extends Counter['length']
    ? Last
    : IdxNextByNumber<N, [ ...Counter, 0 ], IdxNext<Last extends [] ? [[0]] : Last>>

type IdxArr<N extends number, Arr = IdxNextByNumber<N>> =
  Arr extends [ infer A extends 0[], ...infer Rest extends 0[][] ]
    ? [ A['length'], ...IdxArr<0, Rest> ]
    : []

type Pascal<N extends number, Counter extends 0[] = []> =
  N extends Counter['length']
    ? []
    : [ IdxArr<Counter['length']>, ...Pascal<N, [ ...Counter, 0 ]> ]
```

- 배열의 길이를 이용하여 숫자를 이용하는 기본적인 방식을 활용용
- `IdxNext`는 파스칼 삼각형의 다음 행을 계산한다.
  - 배열에서 첫 두 원소(A, B)를 추출하고, 이 둘을 합친 배열 `[...A, ...B]`를 생성
  - 재귀적으로 나머지 원소들에 대해 같은 처리를 반복하며 파스칼 행을 구성
- `IdxNextByNumber`는 N번째 행을 계산하기 위해 0부터 N-1까지 IdxNext를 반복 적용
  - Counter를 이용해 재귀 횟수를 계산하고, Last 인자에 이전 행을 전달하여 다음 행을 계산
- `IdxArr`는 0 배열의 길이를 이용해 표현된 행을 실제 숫자 배열로 변환
  - 각 0[] 배열의 length 속성을 추출하여 실제 숫자 값으로 변환
- `Pascal`은 최종적으로 N개 행을 가진 파스칼 삼각형을 생성
  - Counter를 증가시키며 0부터 N-1까지의 각 행을 계산
  - 각 행은 IdxArr를 통해 변환된 숫자 배열 형태로 표현됨
