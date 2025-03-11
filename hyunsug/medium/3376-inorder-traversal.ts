interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}
type InorderTraversal<T extends TreeNode | null> = T extends TreeNode
  ? [...InorderTraversal<T["left"]>, T["val"], ...InorderTraversal<T["right"]>]
  : [];

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

const tree2 = {
  val: 1,
  left: null,
  right: null,
} as const;

const tree3 = {
  val: 1,
  left: {
    val: 2,
    left: null,
    right: null,
  },
  right: null,
} as const;

const tree4 = {
  val: 1,
  left: null,
  right: {
    val: 2,
    left: null,
    right: null,
  },
} as const;

type InorderTraversalTest0 = InorderTraversal<null>; // []
type InorderTraversalTest1 = InorderTraversal<typeof tree1>; // [1, 3, 2]
type InorderTraversalTest2 = InorderTraversal<typeof tree2>; // [1]
type InorderTraversalTest3 = InorderTraversal<typeof tree3>; // [2, 1]
type InorderTraversalTest4 = InorderTraversal<typeof tree4>; // [1, 2]
