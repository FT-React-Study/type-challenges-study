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

- `Python`의 `any()` 함수는 전달된 Iterable의 요소가 하나라도 참인 경우 true를 반환한다.

```ts
// 시행착오 1
type FalsyLiteral = 0 | "" | false | [] | {} | undefined | null;

type AnyOf<T extends any[], Result extends boolean = false> = T extends [
  infer F,
  ...infer R
]
  ? F extends FalsyLiteral
    ? AnyOf<R, false>
    : AnyOf<R, true>
  : Result;
```

- 누적 처리 오류: 앞에서 true로 처리되었어도, 뒤에서 false로 처리되면 결과가 false로 나오게 됨

```ts
// 시행착오 2
type FalsyLiteral = 0 | "" | false | [] | {} | undefined | null;

type AnyOf<T extends any[], Result extends boolean = false> = T extends [
  infer F,
  ...infer R
]
  ? F extends FalsyLiteral
    ? Result extends true
      ? Result
      : AnyOf<R, false>
    : AnyOf<R, true>
  : Result;
```

- FalsyLiteral의 빈 객체 타입을 처리를 다르게 해야 함
- `{}` 빈 객체는 타입스크립트에서 거의 모든 값(숫자, 불리언, 문자열 배열 등)을 포함할 수 있는 타입

```ts
type FalsyLiteral = type FalsyLiteral =
  | 0
  | ""
  | false
  | []
  | undefined
  | null
  | { [key: keyof any]: never };

type AnyOf<T extends any[], Result extends boolean = false> = T extends [
  infer F,
  ...infer R
]
  ? F extends FalsyLiteral
    ? Result extends true
      ? Result
      : AnyOf<R, false>
    : AnyOf<R, true>
  : Result;
```

- `{ [key: keyof any]: never }`는 명시적으로 빈 객체를 표현할 수 있는 타입
- `infer F, ...infer R`형태로 재귀를 통해 처리하며, 순차적으로 요소를 확인하여 FalsyLiteral을 확인하되
- `Result`가 이미 true인 경우 즉시 반환하도록 처리

## [Medium-1042-IsNever](./medium/1042-is-never.ts)

```ts
type IsNever<T> = [T] extends [never] ? true : false;
```

- 지난 Week 5의 [`Permutation`](./medium/296-permutation.ts)에서 이용했던 방법
- `[T]`를 통해 타입 T를 배열 혹은 튜플로 묶어 `never`를 만나 평가를 중단하지 않도록 하고
- `extends [never]`을 통해 `never` 타입인 경우 true, 그렇지 않은 경우 false를 반환

## [Medium-1097-IsUnion](./medium/1097-is-union.ts)

## [Medium-1130-ReplaceKeys](./medium/1130-replace-keys.ts)

## [Medium-1367-RemoveIndexSignature](./medium/1367-remove-index-signature.ts)
