# Week 16

## [Medium-18220-Filter](./medium/18220-filter.ts)

```ts
type Filter<T extends any[], P> = T extends [infer F, ...infer R]
  ? F extends P
    ? [F, ...Filter<R, P>]
    : Filter<R, P>
  : [];
```

- 원시타입이거나 원시타입의 유니언인 P에 대해, 배열 T의 원소들을 필터링한다
- T를 순회하면서 `F extends P`를 만족할 경우 배열에 담고, 아니라면 `Filter<R, P>`를 호출하여 F를 제외한 나머지를 순회한다.
- 최종적으로 모든 원소를 순회했으나 만족값이 없는 경우 빈 배열을 반환한다.

## [Medium-21104-FindAll](./medium/21104-find-all.ts)

```ts
type FindAll<
  T extends string,
  P extends string,
  C extends unknown[] = [],
  Result extends number[] = []
> = T extends ""
  ? P extends ""
    ? []
    : Result
  : P extends ""
  ? []
  : T extends `${infer _}${infer R}`
  ? T extends `${P}${infer _}`
    ? FindAll<R, P, [...C, unknown], [...Result, C["length"]]>
    : FindAll<R, P, [...C, unknown], Result>
  : Result;
```

- 문자열 T에서 P가 등장하는 모든 '시작 인덱스'를 배열로 반환하는 문제
- 단순하게 템플릿 패턴 매칭을 이용하려 했으나, 패턴 매칭으로는 인덱스 값을 추출하기에는 애로사항이 있었음
- 패턴 매칭을 하고 나머지에 대해서만 검증하기에는 문제 요구사항이 `AAAA`, `A`와 같은 경우에서 `0, 1, 2, 3`을 반환해야 하는, 만족하는 모든 지점을 찾아야 하는 것이었음
- 따라서, 전체 순회를 하며 시작하는 그 지점에서 템플릿 리터럴 패턴 매칭을 이용하는 방식으로 진행함

- 먼저 T가 빈 문자열이라면 P를 검증하고, P도 빈 문자열이라면 빈 배열을, P가 찾고자하는 문자가 있었다면 순회를 종료하고 결과를 반환
- T가 빈 문자열이 아니지만 P가 빈 문자열이라면 빈 배열을 반환
- 둘다 빈 문자열이 아니라면 T를 하나씩 순회하며 패턴 매칭을 진행하고, C로 인덱스값을, Result로 결과값을 담도록 함

## [Medium-21106-CombinationKeyType](./medium/21106-combination-key-type.ts)

```ts
type Combs<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F} ${R[number]}` | Combs<R>
  : never;
```

- 배열 T의 원소들을 조합하여 반환하되, 앞선 원소들은 뒤의 원소들의 뒤로 배치되어서는 안됨
- 따라서, `${F} ${R[number]}`를 이용하여 먼저 앞선 문자를 기준으로 조합을 구성하고 남은 문자들을 기준으로 `Combs<R>`을 수행하면
- `F (분배된)R[number]`와 `남은 원소의 첫번째 - 남은 원소의 두번째부터 나머지`... 의 유니언이 반환됨

## [Medium-21220-PermutationsOfTuple](./medium/21220-permutations-of-tuple.ts)

## [Medium-25170-ReplaceFirst](./medium/25170-replace-first.ts)

## [Medium-25270-Transpose](./medium/25270-transpose.ts)
