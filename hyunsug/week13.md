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

## [Medium-5360-Unique](./medium/5360-unique.ts)

## [Medium-5821-MapTypes](./medium/5821-maptypes.ts)

## [Medium-7544-ConstructTuple](./medium/7544-construct-tuple.ts)

## [Medium-8640-NumberRange](./medium/8640-number-range.ts)
