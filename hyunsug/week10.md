# Week 10

## [Medium-3188-TupleToNestedObject](./medium-3188-tuple-to-nested-object.ts)

```ts
type TupleToNestedObject<T extends readonly string[], U> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? { [K in First]: TupleToNestedObject<Rest, U> }
  : U;
```

- `string[]` 형태로 주어진 배열을 중첩된 객체로 변환한다
- `infer` 키워드를 사용하여 `First`와 `Rest`를 나누고, `First`를 키로 하는 객체를 재귀적으로 생성한다.
- 주어진 tuple이 empty인 경우 U에 주어진 타입을 그대로 반환하도록 문제가 제시하고 있다.

## [Medium-3192-Reverse](./medium/3192-reverse.ts)

```ts
type Reverse<T extends readonly any[]> = T extends [infer First, ...infer Rest]
  ? [...Reverse<Rest>, First]
  : T;
```

- `T extends [infer First, ...infer Rest]` 형태로 주어진 배열을 나눈다.
- `First`를 배열의 마지막 요소로 두고 `Rest`를 spread하며 재귀적으로 호출한다.
- T에 튜플이 아닌 primitive type(`string`, `number` 등) 혹은 객체(`{ [key: keyof any]: any }`)가 들어오는 경우 에러를 발생시키도록 제시하고 있기 때문에, T의 타입을 `readonly any[]`로 제한한다.

## [Medium-3196-FlipArguments](./medium/3196-flip-arguments.ts)

```ts
type ReverseArgs<Args extends any[]> = Args extends [infer First, ...infer Rest]
  ? [...ReverseArgs<Rest>, First]
  : Args;

type FlipArguments<T extends (...args: any[]) => any> = T extends (
  ...args: infer Args
) => infer R
  ? (...args: ReverseArgs<Args>) => R
  : never;
```

- `FlipArguments` 함수는 주어진 인자의 순서를 뒤집는다.
- 앞선 `Reverse` 타입을 활용할 수 있고, 보다 의미를 드러내기 위해 `ReverseArgs` 타입으로 정의했다.
- `T extends (...args: any[]) => any` 형태로 제약을 두어 문제의 에러조건에 맞게 함수로 T를 제한하도록 한다.
- `(...args: infer Args)`를 통해 Args를 추론하고, `(...args: ReverseArgs<Args>) => R` 형태로 뒤집어 반환한다.

## [Medium-3243-FlattenDepth](./medium/3243-flatten-depth.ts)

## [Medium-3326-BEMStyleString](./medium/3326-bem-style-string.ts)

## [Medium-3376-InorderTraversal](./medium/3376-inorder-traversal.ts)
