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

## [Medium-21106-CombinationKeyType](./medium/21106-combination-key-type.ts)

## [Medium-21220-PermutationsOfTuple](./medium/21220-permutations-of-tuple.ts)

## [Medium-25170-ReplaceFirst](./medium/25170-replace-first.ts)

## [Medium-25270-Transpose](./medium/25270-transpose.ts)
