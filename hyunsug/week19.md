# Week 19

## [Medium-30970-IsFixedStringLiteralType](./medium/30970-is-fixed-string-literal-type.ts)

```ts
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type IsUnion<T, U = T> = [T] extends [never]
  ? false
  : T extends T
  ? [U] extends [T]
    ? false
    : true
  : false;

type IsDynamic<T> = Equal<T, string> extends true
  ? true
  : Equal<T, `${bigint}`> extends true
  ? true
  : Equal<T, `${number}`> extends true
  ? true
  : Equal<T, `${boolean}`> extends true
  ? true
  : Equal<T, `${string & {}}`> extends true
  ? true
  : false;

type IsFixedStringLiteralType<S extends string> = [S] extends [never]
  ? false
  : IsUnion<S> extends true
  ? false
  : S extends `${infer F}${infer Rest extends string}`
  ? IsDynamic<F> extends true
    ? false
    : Rest extends ""
    ? true
    : IsFixedStringLiteralType<Rest>
  : false;
```

```ts
type VariableTemplateTypes =
  | `${string}`
  | `${string & {}}`
  | `${number}`
  | `${bigint}`
  | `${boolean & {}}`;
```

- 처음에는 위의 `VariableTemplateTypes`를 이용하여 하나씩 타입 검사를 진행하려 했으나 유니언을 Equal 타입에 전달하는 것보다 분리하여 전달하는게 낫다고 판단함

- 먼저 `[never]`과의 비교로 never 타입을 제거하고, IsUnion을 통해 fixed string이 아닌 유니언을 제거
- IsDynamic에 전달하기 위해 문자열을 하나씩 분리하여 전달함
- 이때, F가 `true`, `false`, `null`, `undefined`인 경우 템플릿 리터럴로 감쌀 시 이는 단순한 문자열이 되어 `t`, `f`와 같이 문자열이 조각나 전달됨
- 하지만, `${string}`과 같은 경우 `string`이 전달되어 Equal 타입에서 Dynamic 타입으로 판단됨
- 분해된 문자열을 순차적으로 진행하며 Rest에 대해서도 반복하고, Rest 반복이 끝났을 때 빈 문자열이라면 Fixed 스트링 리터럴로 판단함

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

```ts
type DefinedPartial<T, K extends keyof T = keyof T> = K extends any
  ? T | DefinedPartial<Omit<T, K>>
  : never;
```

- 처음에는 AllCombination과 같은 이전의 타입들을 활용할 방안을 생각했음
- 하지만 직접 활용하는 대신 앞선 문제들의 활용 방향들을 생각하여 풀이를 진행함
- `T`에 타입 제한을 걸지는 않았지만 `Record<string, any>`의 형태를 받게 됨
- `K`를 `keyof T`로 제한하고 `keyof T`로 초기화함
- `K extends any` (or `unknown` 등등)을 통해 K를 분배함
- `T | DefinedPartial<Omit<T, K>>` 형태로 원래의 객체와, 각각 분배된 K를 키로 갖지 않는 나머지 객체를 유니언으로 합치고 이를 재귀를 진행하여 단일 키를 갖는 객체들까지 생성하여 반환함In

## [Medium-35045-LongestCommonPrefix](./medium/35045-longest-common-prefix.ts)

```ts
type CommonPrefix<
  A extends string,
  B extends string
> = A extends `${infer F}${infer RestOfA}`
  ? B extends `${F}${infer RestOfB}`
    ? `${F}${CommonPrefix<RestOfA, RestOfB>}`
    : ""
  : "";

type LongestCommonPrefix<T extends string[]> = T extends [
  infer A extends string,
  infer B extends string,
  ...infer Rest extends string[]
]
  ? LongestCommonPrefix<[CommonPrefix<A, B>, ...Rest]>
  : T extends [infer Only extends string]
  ? Only
  : "";
```

- 문자열 튜플 T에서 공통 prefix를 찾는 문제
- `CommonPrefix<A, B>`는 A와 B의 공통 prefix를 찾는 형태로, A에서 F를 떼어내고, B가 F로 시작하는 패턴매칭에 부합하는 경우
  F로 시작하는 문자열에 이어서 A와 B의 남은 문자열을 다시 CommonPrefix로 재귀를 진행하여 최종적으로 prefix를 반환
- 이 헬퍼 타입을 이용하여 Tuple T의 첫 두 요소로부터 공통 prefix를 찾고, 이 prefix와 다음 원소를 비교하는 식으로 재귀를 진행
- 마지막에 `[infer Only extends string]` 형태로, 마지막 남은 원소 (최종적인 Prefix)를 반환하거나
- 빈 문자열을 반환하는 형태로 종료

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
