# Week 6

## [Medium-459-Flatten](./medium/459-flatten.ts)

```ts
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : T;
```

- 배열 T를 재귀적으로 평탄화하는 형태
- `infer First`를 통해 첫 요소를 추출하고, 그것이 배열이라면 spread 연산자를 통해 평탄화한다.
- 만약 첫 요소가 배열이 아니라면 그냥 추가한다.
- 이렇게 재귀적으로 평탄화를 진행하면 최종적으로 모든 요소가 평탄화된 배열을 얻을 수 있다.

## [Medium-527-AppendToObject](./medium/527-append-to-object.ts)

```ts
type AppendToObject<T, U extends string, V> = {
  [key in keyof T | U]: key extends keyof T ? T[key] : V;
};
```

- 객체 T에 새로운 프로퍼티 U를 추가하고 그 값을 V로 설정하는 타입
- `keyof T | U`를 통해 기존 객체의 키와 새로운 키를 유니언으로 합친다
- `key extends keyof T`를 통해 기존 객체의 키인 경우 기존 값을 유지하고, 새로운 키인 경우 V를 값으로 설정한다

```ts
// 이것도 가능하지 않은가?
type AppendToObject<T, U extends string, V> = T & { [key in U]: V };
```

- 두번째 방식은 intersection 타입을 사용하는 것으로, 기존 객체와 새로운 프로퍼티를 가진 객체를 합치는 방식이다
- 하지만 이 방식은 추가되는 키가 완전히 새로운 키인 경우에만 적합하다
- intersection 타입은 두 타입을 모두 만족하는 타입을 생성하는데, 이는 새로운 객체를 생성하는 것이 아니라 기존 객체에 프로퍼티를 추가하는 것과는 다르다
- 추가로 해당 챌린지에서 사용하는 `Equal<A, B>` 타입을 만족하지 않는다.

```ts
Equal<{ name: "john"; age: 100 }, { name: "john"; age: 100 }>; // => true
Equal<{ name: "john"; age: 100 }, { name: "john" } & { age: 100 }>; // => false
```

## [Medium-529-Absolute](./medium/529-absolute.ts)

```ts
type Absolute<T extends number | string | bigint> =
  `${T}` extends `-${infer NumberString}` ? NumberString : `${T}`;
```

- 숫자, 문자, bigint 타입을 받아 절대값을 취해 문자열 리터럴 타입을 반환하는 타입이다
- `${T}`를 이용하여 문자열로 변환하고 이것이 `-${infer NumberString}` 형태인지 확인한다
- 만약 그렇다면 `NumberString`를 반환하고, 그렇지 않다면 `${T}`를 반환한다

## [Medium-531-StringToUnion](./medium/531-string-to-union.ts)

```ts
type StringToUnion<
  T extends string,
  U extends string = never
> = T extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest, U>
  : U;
```

- 문자열 T를 재귀적으로 분리하여 유니언 타입으로 반환하는 타입이다
- `${infer First}${infer Rest}`를 통해 첫 문자와 나머지 문자열을 추출한다
- U를 never로 설정하여 최종적으로 StringToUnion<"">의 결과가 never가 되게 하여 종료조건을 만든다.

```ts
type StringToUnion<T extends string> = T extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest>
  : never;
```

- 하지만 위의 방법은 최종적으로 never를 반환하게 하는것과 동일한 형태로 U가 불필요하다 볼 수 있다.

## [Medium-599-Merge](./medium/599-merge.ts)

```ts
type Merge<T, U> = {
  [key in keyof T | keyof U]: key extends keyof U
    ? U[key]
    : key extends keyof T
    ? T[key]
    : never;
};
```

- Mapped Type을 이용하는 방식으로 후행하는 U의 키를 우선하여 value의 타입을 결정한다.

## [Medium-612-KebabCase](./medium/612-kebab-case.ts)

```ts
type ConcatWithHyphen<T extends string[]> = T extends []
  ? ""
  : T extends [infer First extends string, ...infer Rest extends string[]]
  ? Rest extends []
    ? `${First}`
    : `${First}-${ConcatWithHyphen<Rest>}`
  : never;

type KebabCase<
  T extends string,
  Temp extends string = "",
  Parts extends string[] = []
> = T extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? Temp extends ""
      ? KebabCase<Rest, Lowercase<First>, Parts>
      : KebabCase<Rest, Lowercase<First>, [...Parts, `${Temp}`]>
    : KebabCase<Rest, `${Temp}${First}`, Parts>
  : ConcatWithHyphen<[...Parts, Temp]>;
```

- 문자열 T를 재귀적으로 분리하여 마지막에 합치는 형태를 고안했던 첫번재 풀이
- Temp에 대문자로 시작하는 문자열을 담고, Parts에 다음 대문자를 만났을 때 그 Temp를 넣은 후 Temp를 비우는 형태의 순서를 취하게 했다.
- 이 방식은 이모지를 만났을 때와 do-nothing과 같이 소문자만으로 이루어지면서 -를 문자열 중간에 가지는 경우 문제가 있었다.

```ts
type UppercaseLetter = "A" | ... | "Z" // A부터 Z까지의 알파벳 대문자

type ConcatWithHyphen<T extends string[]> = // 위와 동일

type KebabCase<
  T extends string,
  Temp extends string = "",
  Parts extends string[] = []
> = T extends `${infer First}${infer Rest}`
  ? First extends UppercaseLetter
    ? Temp extends ""
      ? KebabCase<Rest, Lowercase<First>, Parts>
      : KebabCase<Rest, Lowercase<First>, [...Parts, `${Temp}`]>
    : KebabCase<Rest, `${Temp}${First}`, Parts>
  : ConcatWithHyphen<[...Parts, Temp]>;
```

- `Uppercase<First>`가 아닌 UppercaseLetter 유니언과 비교하여 대문자인 경우에 필터링을 진행하도록 했다.
- 이모지를 만날때나, 특수문자를 만날 때 `${Temp}${First}`로 진행하게 된다.

```ts
type KebabCase<T extends string> = T extends `${infer First}${infer Rest}`
  ? Rest extends Uncapitalize<Rest>
    ? `${Uncapitalize<First>}${KebabCase<Rest>}`
    : `${Uncapitalize<First>}-${KebabCase<Rest>}`
  : T;
```

- 유틸리티 타입 `Uncapitalize`를 이용하는 방법
- `Uncapitalize`는 문자열의 첫 문자를 소문자로 변경하는 타입이다
- 이 타입을 이용하여 문자열을 분리하고, 첫 문자를 소문자로 변경하여 재귀적으로 진행한다.
- 소문자로 변경한 후 나머지가 소문자로 이루어져 있는지 확인하고, 그렇다면 그냥 붙이고, 아니라면 하이픈을 붙인다.

- 이모지는 왜 `"�-�"`로 분해가 되었을까?
- [Emojis in JavaScript](https://thekevinscott.com/emojis-in-javascript/)

### Emojis in JavaScript

- **이모지의 내부 구성**

  - 실제로 하나의 문자처럼 보이지만, 내부적으로는 **서로게이트 페어 (surrogate pairs)**, 즉 두 개의 UTF-16 코드 유닛으로 이루어짐.

  - 예를 들어, 😎 이모지는 실제로는 두 개의 유닛으로 이루어짐:

    - 첫 번째 유닛: `0xD83D`
    - 두 번째 유닛: `0xDE0E`

```js
const a = "😎".charCodeAt(0); // 55357
const b = "😎".charCodeAt(1); // 56806

const emoji = String.fromCharCode(a, b); // 😎
```

- **Template Literal Type 분해 이슈**

  - `${infer First}${infer Rest}`를 사용하면, 이모지의 두 코드 유닛이 각각 분리되어 매칭됨.

- **결합 시 하이픈 문제**
  - 분리된 코드 유닛들을 하이픈(`-`)으로 연결하는 로직이 적용되면,
  - 원래 하나의 이모지가 "코드 유닛-코드 유닛" 형태로 결합되어 예상과 다른 결과가 나타남.

```

```
