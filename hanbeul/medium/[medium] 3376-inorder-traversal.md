# 3376 - InorderTraversal

## 문제

이진 트리의 중위 순회를 구현하는 타입을 작성하세요.

> 예시

```typescript
const tree1 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: {
      val: 3,
      left: null,
      right: null,
    },
    right: null,
  },
} as const;

type A = InorderTraversal<typeof tree1>; // [1, 3, 2]
```

## 풀이

### 시도 1 (정답)

> 접근 방식

- 재귀를 통해 중위 순회를 구현하자.
- 중위 순회는 왼쪽, 밸류값, 오른쪽 순서로 순회.

> 코드

```typescript
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

type InorderTraversal<T extends TreeNode | null> = T extends TreeNode
  ? [...InorderTraversal<T["left"]>, T["val"], ...InorderTraversal<T["right"]>]
  : [];
```

> 코드 설명

- `T extends TreeNode` 형태로 TreeNode 타입인 경우 재귀 호출
- `T extends TreeNode | null` 형태로 TreeNode 타입이 아닌 경우 빈 배열 반환
- `[...InorderTraversal<T["left"]>, T["val"], ...InorderTraversal<T["right"]>]` 형태로 왼쪽, 밸류값, 오른쪽 순서로 순회
