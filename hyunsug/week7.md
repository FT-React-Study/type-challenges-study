# Week 7

## [Medium-645-Diff](./medium/645-diff.ts)

```ts
type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>;
```

- `O & O1`을 통해 두 객체가 가진 key 값을 모두 포함할 수 있는 객체를 생성하고, 중복되는 key를 제거하는 형태
- `O & O1`은 객체간의 인터섹션으로, 객체의 인터섹션은 모든 키를 포함하는 객체를 생성한다. (동일한 key가 있다면, 해당 key의 value의 타입은 O[key]와 O1[key]가 intersection된 타입을 갖게 된다.)
- `keyof (O | O1)`은 `O | O1` 연산을 먼저 수행하고 `keyof` 연산을 수행하며,
- `keyof` 연산은 유니언 타입에 대해 실행되면, 유니언 구성원이 공통으로 갖는 키만을 반환한다.
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
type FalsyLiteral =
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

```ts
type IsUnion<T, U = T> = T extends any
  ? [U] extends [T]
    ? false
    : true
  : never;
```

- `T extends any`는 유니언 타입에 대해 분배 법칙을 적용하기 위한 조건
- `[U]`는 원본 타입을 보존하고 있으며, `[T]`는 분배된 개별 타입
- 유니언 타입이 아닌 경우: `[U] extends [T]`가 항상 true가 되어 false를 반환
- 유니언 타입인 경우: 분배된 `T`의 개별 타입과 원본 `U`를 비교할 때 `[U] extends [T]`가 false가 되어 true를 반환

- 예시: T가 `string | number`인 경우
  - T는 `string`과 `number`로 분배되고고
  - `[string | number] extends [string]`은 `false`
  - `[string | number] extends [number]`은 `false`
  - 따라서 `true`를 반환하여 유니언 타입임을 판별한다

## [Medium-1130-ReplaceKeys](./medium/1130-replace-keys.ts)

```ts
type ReplaceKeys<U, T, Y extends { [key: keyof any]: any }> = U extends U
  ? { [K in keyof U]: K extends T ? Y[K & keyof Y] : U[K] }
  : never;
```

- `U extends U`는 타입 U가 자기 자신인 경우 true를 반환하며, 이는 유니언 타입인 경우 분배를 유도하는 방식
- `{ [K in keyof U]: K extends T ? Y[K & keyof Y] : U[K] }`는 타입 U의 모든 키를 순회하며, 키 K가 T와 일치하는 경우 Y의 키로 대체하고, 그렇지 않은 경우 원래 키 K를 유지하는 형태
- 이 때, `[K & keyof Y]`는 K가 Y에 존재하는 key라면, `Y[K]`타입으로 교체를 진행하고, 그렇지 않은 경우
- `[K & keyof Y]`는 존재하지 않는 키이므로 `never`로 평가되어, `Y[never]`가 되어 `K: never`로 평가된다.

## [Medium-1367-RemoveIndexSignature](./medium/1367-remove-index-signature.ts)

```ts
type RemoveIndexSignature<T> = {
  [K in keyof T as string extends K
    ? never
    : number extends K
    ? never
    : symbol extends K
    ? never
    : K]: T[K];
};
```

- `K`는 `keyof T`에 해당하는 키 값이다
- `index signature`는 객체 내 반복되는 키-밸류 형태를 나타내기 위해 이용되며, 리터럴 타입이 아닌 일반적인 타입을 이용한다.
- `PropertyKey`로 이용되는 `string | number | symbol` 타입으로 나타나는 K, 즉 인덱스 시그니처인 K를 제외하기 위해
- `string extends K`, `number extends K`, `symbol extends K` 조건을 이용하며, 리터럴 타입이 아닌 K를 제외한다.
