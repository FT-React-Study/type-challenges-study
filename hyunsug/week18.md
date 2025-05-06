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