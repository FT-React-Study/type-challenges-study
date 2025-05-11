# Week 19

## [Medium-30970-IsFixedStringLiteralType](./medium/30970-is-fixed-string-literal-type.ts)

## [Medium-34007-CompareArrayLength](./medium/34007-compare-array-length.ts)

```ts
type CompareArrayLength<T extends any[], U extends any[]> = [T, U] extends [
  [infer _, ...infer TRest],
  [infer _, ...infer URest]
]
  ? CompareArrayLength<TRest, URest>
  : [T, U] extends [[], []]
  ? 0
  : T extends []
  ? -1
  : 1;
```

- 두 배열의 길이를 비교하기 위해 단순하게, 두 배열을 모두 분해하여 하나씩 제거하는 과정을 반복한다
- T, U 어느 배열이라도 빈 배열이 된다면 재귀가 종료되고 비교로 넘어간다
- 두 배열 모두 빈 배열 리터럴과 매칭이 된다면 이는 동시에 비워진 형태가 되어 같은 길이의 배열이다
- 어느 배열이라도 빈 배열이 되었는데 그게 T라면 T의 길이가 더 짧으므로 -1을, 아니라면 1을 반환한다

## [Medium-34857-DefinedPartialRecord](./medium/34857-defined-partial-record.ts)

## [Medium-35045-LongestCommonPrefix](./medium/35045-longest-common-prefix.ts)

## [Medium-35191-Trace](./medium/35191-trace.ts)

## [Medium-35252-IsAlphabet](./medium/35252-is-alphabet.ts)
