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
