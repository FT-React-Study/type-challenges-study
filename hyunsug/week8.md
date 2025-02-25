# Week 8

## [Medium-1978-PercentageParser](./medium/1978-percentage-parser.ts)

- `${infer F}${infer N}${infer S}` 형태로 진행하고 F, S가 각각의 Sign을 만족하는지를 판별하려 했으나
- 해당 위치가 비어있는 경우 N에 해당하는 부분이 쪼개지는 경우가 발생

```ts
type PlusMinus = "+" | "-";
type PercentSign = "%";

// Divide the string into prefix and rest
type PrefixCheck<T extends string> = T extends PlusMinus ? T : never;
type SuffixCheck<T extends string> = T extends `${infer R}${PercentSign}`
  ? [R, "%"]
  : [T, ""];

type PercentageParser<P extends string> =
  P extends `${infer Prefix}${infer Rest}`
    ? Prefix extends PlusMinus
      ? [Prefix, ...SuffixCheck<Rest>]
      : ["", ...SuffixCheck<Rest>]
    : ["", "", ""];
```

- 문자열을 한번에 분리하는게 아니라, 앞부분을 체크해서 operator를 확인하고 나머지에 % 사인이 있는지를 확인하는 형태로 진행
- `${infer F}${infer N}${infer S}` 형태로 만들면, operator가 없는 경우 숫자가 F, N으로 나눠지는 경우가 발생
- 따라서 앞부분을 체크해서 operator를 확인하고 나머지에 % 사인이 있는지를 확인하는 형태로 진행

## [Medium-2070-DropChar](./medium/2070-drop-char.ts)

```ts
type DropChar<
  S extends string,
  C extends string
> = S extends `${infer L}${C}${infer R}` ? DropChar<`${L}${R}`, C> : S;
```

- 문자열을 탈락시킬 C가 중간에 있는 형태로 반복해서 나눠가며 C를 제거하는 형태를 반복
- C가 포함되지 않는 경우 반환하도록 함

## [Medium-2257-MinusOne](./medium/2257-minus-one.ts)

## [Medium-2595-PickByType](./medium/2595-pick-by-type.ts)

```ts
type PickByType<T, Picker> = {
  [K in keyof T as T[K] extends Picker ? K : never]: T[K];
};
```

- keyof를 통해 K를 순회하며 `T[K]`(value)의 타입이 Picker와 일치하는지를 확인한다
- `T[K] extends Picker ? T[K] : never`로 value에서 검증을 진행하면 `key: never`로 평가되어 해당 key가 제외되지 않는다.
- 따라서 `[K in keyof T as T[K] extends Picker ? K : never]`로 검증을 진행하여 해당 key가 제외되게 한다.

## [Medium-2688-StartsWith](./medium/2688-starts-with.ts)

## [Medium-2693-EndsWith](./medium/2693-ends-with.ts)
