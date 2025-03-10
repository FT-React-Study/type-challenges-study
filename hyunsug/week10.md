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

## [Medium-3196-FlipArguments](./medium/3196-flip-arguments.ts)

## [Medium-3243-FlattenDepth](./medium/3243-flatten-depth.ts)

## [Medium-3326-BEMStyleString](./medium/3326-bem-style-string.ts)

## [Medium-3376-InorderTraversal](./medium/3376-inorder-traversal.ts)
