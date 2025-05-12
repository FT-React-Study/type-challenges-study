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

```ts
type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N ? Acc : Enumerate<N, [...Acc, Acc["length"]]>;

type Trace<
  T extends any[][],
  Indexes extends number[] = Enumerate<T["length"]>
> = {
  [K in keyof Indexes]: T[Indexes[K]][Indexes[K]];
}[number];
```

- `Enumerate`: 배열, 즉 행렬의 길이 크기와 동일하게 숫자 배열을 생성 - 길이가 2라면 [0, 1]
- `[K in keyof Indexes]` 0 ~ `N-1`에 해당하는 숫자를 이용하여 배열 Mapped Type을 생성
- `T[Indexes[K]][Indexes[K]]`는 [0, 0], [1, 1], [2, 2] 의 형태로 각 인덱스에 해당하는 좌상우하로의 대각선 원소들을 추출
- 이를 유니언으로 전환하여 반환

## [Medium-35252-IsAlphabet](./medium/35252-is-alphabet.ts)

```ts
type Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
type StringToTuple<
  S extends string,
  R extends readonly string[] = []
> = S extends `${infer F}${infer Rest}` ? StringToTuple<Rest, [...R, F]> : R;

type IsAlphabet<S extends string> = S extends StringToTuple<Alphabet>[number]
  ? true
  : false;
```

- 알파벳을 모두 갖는 튜플을 만들고, 이를 다시 유니언으로 전환하여 타입 체크를 진행
