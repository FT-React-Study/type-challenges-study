# TS Types - Week 1

## [WarmUp-Hello-World]

```ts
type HelloWorld = string;
```

## [Easy-4-Pick](./easy-4-pick.ts)

- **in** - Mapped Type 안에서 이용될 시, 객체의 키를 순회하며 새로운 타입을 정의하기 위해 이용된다.
  - [MappedType](https://www.typescriptlang.org/ko/docs/handbook/2/mapped-types.html)
- **extends** - `A extends B`와 같이 사용될 시, A가 B의 부분집합을 만족해야함을 의미한다.
- `[Key in K]` - K의 각 값을 순회하며 새로운 객체 타입의 key로 이용하기 위해 사용되었다.
- `T[Key]` - T라는 타입의 객체에서 Key에 해당하는 value의 타입을 지정한다. K가 extends를 통해 `keyof T`를 만족하므로 `Key`는 T 객체의 key이다.

```ts
type MyPick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};
```

## [Easy-7-Readonly](./easy-7-readonly.ts)

- **readonly** - 객체의 속성이나 배열 요소를 읽기 전용으로 지정, 적용된 속성은 초기화 이후 변경될 수 없다. 인터페이스의 각 속성에도 적용할 수 있다.

```ts
type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};
```

## [Easy-11-Tuple-to-Object](./easy-11-tuple-to-object.ts)

- **T[number]** - 배열 T의 각 요소의 타입을 지정한다.

```ts
type TupleToObject<T extends readonly string[]> = {
  [K in T[number]]: K;
};
```

`readonly any[]`를 생각하고 해결해보려 했으나, object의 key는 string | number | symbol이어야 했다.
또한, 주어진 문제 자체는 `readonly string[]`타입이었기에 easy인 해당 문제는 그것을 기반으로 해결하였다.

## [Easy-14-First-of-Array](./easy-14-first-of-array.ts)

- 접근 첫번째

T는 배열이므로 첫번째 원소를 return: 빈 배열에 대해 적합하지 않음 (타입에러 발생생)

```ts
type First<T extends any[]> = T[0];
```

- 접근 두번째

T가 빈 배열이라면 원소 타입을 리턴할 수 없으니 "빈 배열 타입"인 `[]`와 비교한다.

```ts
type First<T extends any[]> = T extends [] ? never : T[0];
```

- 추가적인 방식

**`infer`**: Conditional과 함께 이용되어야만 하며, 타입스크립트에 의한 타입 추론과 함께 이용한다.

```ts
type First<T extends any[]> = T extends [infer A, ...infer rest] ? A : never;
```

이 방식은 Array의 구조분해할당을 이용하는 방식으로 첫번째 원소의 타입을 A로 추론하고 존재한다면 A를, 빈 배열이어서 존재하지 않는다면 `never`를 가지게 하는 방식이다.

## [Easy-18-Easy-Tuple-Length](./easy-18-easy-tuple-length.ts)

```ts
type Length<T extends any[]> = T["length"];
```

type T는 Array의 부분집합이므로, Array객체의 "length" 속성을 사용할 수 있음
단, 이 경우 T에 해당하는 튜플은 길이가 정해져 있기 때문에 T["length"]는 number 타입을 갖는 정수 리터럴 타입이 된다.
하지만, `type X = string[]`과 같이 단순한 배열인 경우 `type K = T["length"]`는 number르 나타난다.

## [Easy-43-Easy-Exclude](./easy-43-easy-exclude.ts)

`Exclude`를 구현하는 문항, Exclude는 UnionType에서 제외할 것을 제외한 나머지를 타입으로 리턴하는 역할을 한다.
[Exclude<UnionType, ExcludedMembers>](https://www.typescriptlang.org/docs/handbook/utility-types.html#excludeuniontype-excludedmembers)

```ts
type MyExclude<T, U> = T extends U ? never : T;
```

타입스크립트 타입 적용에 **조건부 타입의 분배 법칙**이 적용되어 유니언 T의 각 항이 개별적으로 평가된다.

```ts
type T = "a" | "b" | "c";

type Result = MyExclude<T, "a">;

// 이는 다음과 같이 해석, 평가된다.
type Result =
  | ("a" extends "a" ? never : "a")
  | ("b" extends "a" ? never : "b")
  | ("c" extends "a" ? never : "c");

// 그리고 never가 아닌 타입들의 유니언타입으로 형성된다.
```

never가 유니언에서 제거되는 이유는 "no value"를 명시하는 타입으로, 타입스크립트에 의해 축약/제거되기 때문이다.
[참고자료](https://www.typescripttutorial.net/typescript-tutorial/typescript-never-type/)

`null`과 다른 점이라면, null은 값에 null을 가지고 있는 것이고 `never`는 정말로 값이 없는 것, 집합에서의 공집합을 의미하기 떄문이라 한다.

추가로 살펴볼 것: 집합론과 함께 타입스크립트의 타입의 이해
[자료 1](https://thoughtspile.github.io/2023/01/23/typescript-sets/)
[자료 2](https://ivov.dev/notes/typescript-and-set-theory)
