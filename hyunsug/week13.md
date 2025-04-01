# Week 13

## [Medium-5310-Join](./medium/5310-join.ts)

- 문제에서 U 타입을 `string | number`로 제한하고 주어지지 않았을 경우 ','를 기본값으로 사용하도록 제한하고 있음
- 문자열 템플릿에 담기 위해서 T 또한 `string | number`로 제한을 했음

```ts
type Join<
  T,
  U extends string | number = ",",
  Result extends string = ""
> = T extends []
  ? Result
  : T extends [
      infer First extends string | number,
      ...infer Rest extends (string | number)[]
    ]
  ? Result extends ""
    ? Join<Rest, U, `${First}`>
    : Join<Rest, U, `${Result}${U}${First}`>
  : Result;
```

- 첫 번째 접근 방식: `Result` 파라미터를 이용하여 문자열을 누적하는 방식으로 구현하였다.
- `T`는 입력 배열, `U`는 구분자, `Result`는 현재까지 누적된 문자열을 저장한다.
- `T`가 빈 배열이면 누적된 `Result`를 반환한다.
- `T`가 비어있지 않으면 첫 번째 요소와 나머지 요소들을 분리하여 처리한다.
- `Result`가 빈 문자열이면 첫 번째 요소만으로 시작하고, 아니면 구분자와 함께 연결하여 누적한다.
- 재귀적으로 나머지 요소들에 대해 동일한 과정을 반복한다.

```ts
type Join<
  T extends (string | number)[],
  U extends string | number = ","
> = T extends []
  ? ""
  : T extends [infer F extends string | number]
  ? `${F}`
  : T extends [
      infer F extends string | number,
      ...infer R extends (string | number)[]
    ]
  ? `${F}${U}${Join<R, U>}`
  : never;
```

- 두 번째 접근 방식: 추가 제너릭을 사용하지 않은 방법법
- `T`는 `string` 또는 `number`로 이루어진 배열로 제한한다.
- `U`는 구분자로 사용될 `string` 또는 `number` 타입이며, 기본값은 `","`이다.
- `T`가 빈 배열인 경우 빈 문자열을 반환한다.
- `T`가 단일 요소를 가진 배열인 경우 해당 요소만 문자열로 변환하여 반환한다.
- `T`가 여러 요소를 가진 배열인 경우, 첫 번째 요소와 나머지 요소들을 분리하여 처리한다.
- 첫 번째 요소와 구분자를 연결한 후, 나머지 요소들에 대해 재귀적으로 `Join`을 호출하여 결과를 연결한다.
- `never`는 도달할 수 없는 조건절임을 명시한다.

- 이 때 T를 어떤 값도 들어올 수 있는 배열로 제한한다면
- `${F & string}`을 통해 변환가능한 F만을 취하는 방식을 통해 접근할 수 있다
- 혹은 `T extends unknown[]`을 취한 후 `[infer F extends string]`을 통해 문자열만을 취하는 방식을 통해 접근할 수 있다

## [Medium-5317-LastIndexOf](./medium/5317-lastindexof.ts)

```ts
type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <P>() => P extends B
  ? 1
  : 2
  ? true
  : false;
type Pop<T extends readonly unknown[]> = T extends [...infer Rest, infer _]
  ? Rest
  : [];

// Popped는 마지막 원소의 index를 표시하는 배열열
type LastIndexOf<
  T extends readonly unknown[],
  U,
  Popped extends readonly unknown[] = Pop<T>
> = T extends [...infer Rest, infer Last]
  ? Same<Last, U> extends true
    ? Popped["length"]
    : LastIndexOf<Rest, U, Pop<Popped>>
  : -1;
```

- `Same` 타입은 챌린지 전반에 이용되는 보다 정교한 타입비교를 위해 이용
- `Pop` 타입은 `Array.pop` 메서드의 구현형태
- `LastIndexOf`의 `Popped` 타입은 마지막 원소를 제거한 원래 배열로, `Array.length - 1`을 통해 마지막 원소의 index를 구하는 방식을 차용하기 위해 사용했다.
- 원래 배열을 마지막에서부터 `Same`을 이용해 비교하며 `Popped` 튜플의 길이를 통해 그 인덱스를 찾아가도록 했다
- T가 남지 않을 때 -1을 반환하도록 하여 찾을 수 없는 경우를 처리하도록 했다

## [Medium-5360-Unique](./medium/5360-unique.ts)

```ts
type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <P>() => P extends B
  ? 1
  : 2
  ? true
  : false;

type Includes<T extends readonly unknown[], U> = T extends [
  infer First,
  ...infer Rest
]
  ? Same<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false;

type Unique<
  T extends readonly unknown[],
  Uniques extends unknown[] = []
> = T extends [infer First, ...infer Rest]
  ? Includes<Uniques, First> extends true
    ? Unique<Rest, Uniques>
    : Unique<Rest, [...Uniques, First]>
  : Uniques;
```

- `Same` 타입 계속 이용
- `Includes` 타입: 튜플 T에서 U가 존재하는지를 확인하는 타입으로 재귀적으로 `Same`을 이용해 비교
- `Unique` 타입에서 `Uniques`는 빈 배열로 초기화하고 유니크한 원소를 담는 배열로 이용
- `Inlcudes<Uniques, First>`를 반복하며 유니크 원소 배열에 현재 떼어낸 원소가 포함되는지를 반복하며 빈 배열이 될 때까지 반복한다

## [Medium-5821-MapTypes](./medium/5821-maptypes.ts)

```ts
type MapTypes<
  T extends { [key: keyof any]: any },
  R extends { mapFrom: any; mapTo: any }
> = {
  [K in keyof T]: T[K] extends R["mapFrom"] ? R["mapTo"] : T[K];
};
```

- 첫 번째 접근: `T[K] extends R["mapFrom"]`을 통해 타입일치 시 `R["mapTo"]`를 반환하고 아니면 원래 타입 이용용

```ts
type MapTypes<
  T extends { [key: keyof any]: any },
  R extends { mapFrom: any; mapTo: any }
> = {
  [K in keyof T]: T[K] extends R["mapFrom"]
    ? R extends { mapFrom: T[K] }
      ? R["mapTo"]
      : never
    : T[K];
};
```

- 첫번째 방법은 R이 유니언인 경우 `mapFrom`이 Union Type이 되는 경우가 발생
- `MapTypes<{ name: string, date: Date }, { mapFrom: string, mapTo: boolean } | { mapFrom: Date, mapTo: string }>`
- 위의 예시에서 에러가 발생했고 이를 뜯어보면 R이 유니언인 경우 아래와 같이 타입이 정의되었음
- `{mapFrom: string | Date, mapTo: boolean | string}`
- 이 때, `T[K] extends R["mapFrom"]` 조건에서 name의 string이 mapFrom의 string과 매치되어 `R["mapTo"]`의 `string | boolean`이 된다 `date: Date` 또한 마찬가지로 `Date`와 매치되어 `string | boolean`이 된다
- 해결방식은 `T[K] extends R["mapFrom"]`을 사용 후 `R extends { mapFrom: T[K] }` 조건을 통해 유니언 R의 각 요소에 대해 검증을 진행하는 방식을 취할 수 있다

## [Medium-7544-ConstructTuple](./medium/7544-construct-tuple.ts)

## [Medium-8640-NumberRange](./medium/8640-number-range.ts)
