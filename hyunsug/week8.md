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

- 타입 시스템에서 숫자 리터럴의 직접적인 연산은 가능하지 않음
- 배열의 length를 사용하는 방법

```ts
type BuildTuple<
  N extends number,
  T extends unknown[] = []
> = T["length"] extends N ? T : BuildTuple<N, [...T, unknown]>;

type MinusOne<N extends number> = BuildTuple<N> extends [...infer R, unknown]
  ? R["length"]
  : never;
```

- 하지만 이 방법은 재귀의 깊이 제한 문제로 큰 수에 대해서는 사용할 수 없음

- 빼기를 진행하는 과정을 생각해본다면
- 낮은 자리에서 a - b를 진행하되, a < b라면, 앞자리에서 하나를 빌려오는 형태를 취하게 된다
- 이를 타입 시스템에서 표현하려면, 문자열을 뒤집어서 작은 자리부터 빼는 형태로 진행할 수 있다
- 타입 시스템에서 숫자 리터럴의 직접 연산은 불가능하기 때문에, 문자열로 변형하고, 1을 뺀 짝으로 교체하는 형태를 사용할 수 있다

### 구현 방식 설명

1. 숫자를 문자열로 변환하고 뒤집어서 처리

```ts
type Reverse<S extends string> = S extends `${infer F}${infer R}`
  ? `${Reverse<R>}${F}`
  : "";
```

2. 각 자릿수별로 1을 뺀 결과를 매핑

```ts
type DigitMinusMap = {
  "0": "9"; // 0에서 1을 빼면 9가 되고 자리내림 발생
  "1": "0";
  "2": "1";
  // ... 나머지 숫자들
};
```

3. 자리내림(borrow) 처리

- 0에서 1을 빼는 경우 9가 되고 다음 자리에서 1을 더 빼야함
- 이를 위해 MinusOneReversed 타입에서 Borrow 파라미터를 사용
- Borrow 파라미터는 자리내림이 발생했는지 여부를 나타냄

```ts
type MinusOneReversed<
  S extends string,
  Borrow extends boolean = false
> = S extends `${infer F}${infer R}`
  ? F extends "0"
    ? Borrow extends true
      ? `9${MinusOneReversed<R, true>}`  // 자리내림 발생
      : `9${R}`  // 마지막 자리
    : // ... 나머지 로직
```

4. 앞의 불필요한 0 제거

```ts
type RemoveLeadingZeros<S extends string> = S extends "0"
  ? "0"
  : S extends `0${infer R}`
  ? RemoveLeadingZeros<R>
  : S;
```

이러한 방식으로 큰 수에 대해서도 1을 뺄 수 있는 타입을 구현할 수 있습니다.

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

```ts
type StartsWith<S extends string, T extends string> = S extends `${T}${string}`
  ? true
  : false;
```

- `${T}${string}` 형태로 S를 확인하여, T와 나머지 문자열로 구성되었는지를 확인한다

## [Medium-2693-EndsWith](./medium/2693-ends-with.ts)

```ts
type EndsWith<S extends string, T extends string> = S extends `${string}${T}`
  ? true
  : false;
```

- `${string}${T}` 형태로 S를 확인하여, T와 나머지 문자열로 구성되었는지를 확인한다

### 문자열 템플릿 리터럴의 분해: `infer`를 사용한 분해와, 패턴매칭

#### `infer`를 사용한 분해

```ts
type InferExample<S extends string> = S extends `${infer First}${infer Rest}`
  ? [First, Rest]
  : never;

// 사용 예시
type Result1 = InferExample<"hello">; // ["h", "ello"]
```

- `infer`는 타입스크립트에게 "이 부분의 타입을 추론해서 변수에 담아"라고 지시한다
- 패턴 매칭 방식으로 문자열을 원하는 형태로 분해할 수 있다
- 여러 개의 `infer`를 사용하면 문자열을 여러 부분으로 나눌 수 있다
- 분해된 각 부분을 변수에 담아 이후 타입 연산에 활용할 수 있다

#### 템플릿 리터럴 기반 패턴 매칭

```ts
type StartsWithCheck<
  S extends string,
  T extends string
> = S extends `${T}${string}` ? true : false;

// 사용 예시
type Result2 = StartsWithCheck<"hello", "he">; // true
type Result3 = StartsWithCheck<"hello", "lo">; // false
```

- 특정 패턴이 있는지 확인하는 용도로 사용된다
- `infer`를 사용하지 않고 직접 타입을 지정하여 패턴을 검사한다
- 문자열의 구조를 검증하는 데 더 적합하다
- 분해된 부분을 변수로 저장하지 않고 패턴 일치 여부만 확인한다

## 주요 차이점

- **목적**: `infer`는 분해와 추출이 목적이고, 템플릿 리터럴 패턴 매칭은 검증이 목적이다
- **유연성**: `infer`는 추출한 부분을 변수에 담아 재사용할 수 있어 더 유연하다
- **가독성**: 단순 패턴 검증은 템플릿 리터럴 패턴 매칭이 더 직관적이다
- **활용**: 복잡한 문자열 조작은 `infer`가 더 적합하고, 단순 검증은 템플릿 리터럴 패턴 매칭이 더 적합하다

두 방식은 상호 보완적이며 상황에 따라 적절한 방식을 선택하는 것이 중요하다
