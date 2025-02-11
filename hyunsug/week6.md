# Week 6

## [Medium-459-Flatten](./medium/459-flatten.ts)

```ts
type Flatten<T extends any[]> = T extends [infer First, ...infer Rest]
  ? First extends any[]
    ? [...Flatten<First>, ...Flatten<Rest>]
    : [First, ...Flatten<Rest>]
  : T;
```

- 배열 T를 재귀적으로 평탄화하는 형태
- `infer First`를 통해 첫 요소를 추출하고, 그것이 배열이라면 spread 연산자를 통해 평탄화한다.
- 만약 첫 요소가 배열이 아니라면 그냥 추가한다.
- 이렇게 재귀적으로 평탄화를 진행하면 최종적으로 모든 요소가 평탄화된 배열을 얻을 수 있다.

## [Medium-527-AppendToObject](./medium/527-append-to-object.ts)

```ts
type AppendToObject<T, U extends string, V> = {
  [key in keyof T | U]: key extends keyof T ? T[key] : V;
};
```

- 객체 T에 새로운 프로퍼티 U를 추가하고 그 값을 V로 설정하는 타입
- `keyof T | U`를 통해 기존 객체의 키와 새로운 키를 유니언으로 합친다
- `key extends keyof T`를 통해 기존 객체의 키인 경우 기존 값을 유지하고, 새로운 키인 경우 V를 값으로 설정한다

```ts
// 이것도 가능하지 않은가?
type AppendToObject<T, U extends string, V> = T & { [key in U]: V };
```

- 두번째 방식은 intersection 타입을 사용하는 것으로, 기존 객체와 새로운 프로퍼티를 가진 객체를 합치는 방식이다
- 하지만 이 방식은 추가되는 키가 완전히 새로운 키인 경우에만 적합하다
- intersection 타입은 두 타입을 모두 만족하는 타입을 생성하는데, 이는 새로운 객체를 생성하는 것이 아니라 기존 객체에 프로퍼티를 추가하는 것과는 다르다
- 추가로 해당 챌린지에서 사용하는 `Equal<A, B>` 타입을 만족하지 않는다.

```ts
Equal<{ name: "john"; age: 100 }, { name: "john"; age: 100 }>; // => true
Equal<{ name: "john"; age: 100 }, { name: "john" } & { age: 100 }>; // => false
```

## [Medium-529-Absolute](./medium/529-absolute.ts)

```ts
type Absolute<T extends number | string | bigint> =
  `${T}` extends `-${infer NumberString}` ? NumberString : `${T}`;
```

- 숫자, 문자, bigint 타입을 받아 절대값을 취해 문자열 리터럴 타입을 반환하는 타입이다
- `${T}`를 이용하여 문자열로 변환하고 이것이 `-${infer NumberString}` 형태인지 확인한다
- 만약 그렇다면 `NumberString`를 반환하고, 그렇지 않다면 `${T}`를 반환한다

## [Medium-531-StringToUnion](./medium/531-string-to-union.ts)

## [Medium-599-Merge](./medium/599-merge.ts)

## [Medium-612-KebabCase](./medium/612-kebab-case.ts)
