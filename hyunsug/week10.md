# Week 10

## [Medium-3188-TupleToNestedObject](./medium/3188-tuple-to-nested-object.ts)

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

```ts
type FlattenOnce<T extends readonly any[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends readonly any[]
    ? [...First, ...FlattenOnce<Rest>]
    : [First, ...FlattenOnce<Rest>]
  : T;
```

- 한번만 평탄화하는 타입을 먼저 만들어보았다.
- 기본적으로 주어진 배열을 나누고, `First`가 배열이 아니라면 그대로, 배열이라면 평탄화하는 재귀 호출을 이용하게 된다.

```ts
type FlattenDepth<
  T extends readonly any[],
  Depth extends number = 1,
  Count extends any[] = []
> = Count["length"] extends Depth
  ? T
  : T extends [infer First, ...infer Rest]
  ? First extends readonly any[]
    ? [
        ...FlattenDepth<First, Depth, [...Count, 1]>,
        ...FlattenDepth<Rest, Depth, Count>
      ]
    : [First, ...FlattenDepth<Rest, Depth, Count>]
  : T;
```

- `FlattenDepth` 타입은 두 번째 제너릭으로 평탄화할 깊이를 받으며, 기본값은 1이다.
- 세번째 `Count` 제너릭은 평탄화가 진행된 횟수를 카운트하기 위해 숫자 리터럴을 이용하기 위해 빈 배열을 이용한다.

- `Count["length"] extends Depth`는 평탄화가 진행된 횟수가 주어진 횟수와 같은지를 비교하여, 같다면 완료된 타입을 반환한다.
- `T extends [infer First, ...infer Rest]`를 통해 주어진 배열을 나누고, `First`가 배열이라면 평탄화 호출을 진행하고, 배열이 아니라면 그대로 반환한다.
- 이 때, `Count["length"]`를 늘리기 위해 `[...Count, 1]`과 같이 어떤 값이든 추가하여 배열의 길이를 늘린다.
- `Rest`에 대해서 이를 동일하게 적용하여 각 `Rest`의 `First`가 평탄화가 진행된다.

## [Medium-3326-BEMStyleString](./medium/3326-bem-style-string.ts)

```ts
type BEM<
  B extends string,
  E extends string[],
  M extends string[]
> = `${B}${E extends [] ? "" : `__${E[number]}`}${M extends []
  ? ""
  : `--${M[number]}`}`;
```

- `BEM`은 Block Element Modifier 클래스네임을 의미하며, id가 아닌 클래스만으로 의미있는 html class를 작성할 때 주로 사용되는 형태이다.
- `B`는 Block element 클래스네임을 의미, `E`는 Element, `M`은 Modifier를 의미한다.
- 주어진 `B, E, M`을 이용하여 조합된 클래스네임의 유니언을 반환해야 한다.
- template literal 형태를 이용하여 E, M에 대해 빈 배열이라면 빈 문자열을, 아니라면 BEM 형태로 분배하여 반환하게 설정한다.

## [Medium-3376-InorderTraversal](./medium/3376-inorder-traversal.ts)

- Inorder Traversal: 이진 트리에서의 중위 순회를 의미
- 중위 순회란: left -> root -> right 순으로 방문하는 방식이며 자식이 없는 가장 깊은 left node에서 시작한다.

```ts
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

type InorderTraversal<T extends TreeNode | null> = T extends TreeNode
  ? [...InorderTraversal<T["left"]>, T["val"], ...InorderTraversal<T["right"]>]
  : [];
```

- `TreeNode`는 기본적인 이진 트리의 노드 형태이다.
- `InorderTraversal`은 이진 트리에서 중위 순회를 진행한 결과를 튜플로 반환하는 타입이다.
- `T extends TreeNode`를 통해 노드인지를 확인한다.
- 먼저 `...InorderTraversal<T["left"]>`를 통해 left node의 끝을 탐색하여 배열로 변환한다.
- 그 다음 `T["val"]`를 통해 현재 노드의 값을 배열에 추가한다.
- 마지막으로 `...InorderTraversal<T["right"]>`를 통해 right node의 끝을 탐색하여 배열에 추가한다.
- 이 때, `T extends TreeNode | null`을 통해 노드가 아니라면 빈 배열을 반환하도록 한다.
