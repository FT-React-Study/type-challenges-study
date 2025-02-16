# Week 7

## [Medium-645-Diff](./medium/645-diff.ts)

```ts
type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>;
```

- `O & O1`을 통해 두 객체가 가진 key 값을 모두 포함할 수 있는 객체를 생성하고, 중복되는 key를 제거하는 형태
- `keyof (O | O1)`은 `O | O1` 연산을 먼저 수행하고 `keyof` 연산을 수행한다.
- `O | O1`의 유니언을 형성할 때, keyof를 실행하면 유니언 구성원 모두가 가지고 있는 키만 반환한다.
- `keyof O | keyof O1`은 `O`와 `O1`의 키가 모두 포함된 유니언을 반환한다. (모든 key값을 얻고자 할때 사용할 수 있다)

## [Medium-949-AnyOf](./medium/949-any-of.ts)

## [Medium-1042-IsNever](./medium/1042-is-never.ts)

## [Medium-1097-IsUnion](./medium/1097-is-union.ts)

## [Medium-1130-ReplaceKeys](./medium/1130-replace-keys.ts)

## [Medium-1367-RemoveIndexSignature](./medium/1367-remove-index-signature.ts)
