# Week 9

## [Medium-2757-PartialByKeys](./medium/2757-partial-by-keys.ts)

```ts
type IntersectionToObj<T> = {
  [K in keyof T]: T[K];
};

type PartialByKeys<T, K extends keyof T = never> = [K] extends [never]
  ? Partial<T>
  : IntersectionToObj<
      {
        [Key in keyof T as Key extends K ? Key : never]+?: T[Key];
      } & {
        [Key in Exclude<keyof T, K>]: T[Key];
      }
    >;
```

- `K`가 주어지지 않은 경우 `never`로 처리하도록 기본값을 설정하고, 검증 후 `Partial`로 문제 의도에 따라 모든 key에 대해 optional 처리를 한다.
- 그렇지 않은 경우, `T`의 key인 `K`에 대해서는 optional 처리를 한 object와, 그렇지 않은 원래 상태를 그대로 유지하는 object를 만들고 intersection한다.
- 그리고 추가적인 타입 `IntersectionToObj`를 이용하여 합쳐진 Obj type을 생성한다.
- `+?`는 명시적으로 optional 처리를 해주는 키워드이다. `?`와 비슷하지만, 조금 더 명확하게 나타낼 수 있다.

## [Medium-2759-RequiredByKeys](./medium/2759-required-by-keys.ts)

```ts
type IntersectionToObj<T> = {
  [K in keyof T]: T[K];
};

type RequiredByKeys<T, K extends keyof T = never> = [K] extends [never]
  ? Required<T>
  : IntersectionToObj<
      {
        [Key in keyof T as Key extends K ? Key : never]-?: T[Key];
      } & {
        [Key in Exclude<keyof T, K>]: T[Key];
      }
    >;
```

- 앞선 `PartialByKeys`의 역방향으로 접근했다.
- 주어진 Key에 대해서는 모두 필수 처리를 하고, 그렇지 않은 경우 optional 처리를 한다.
- `-?`는 명시적으로 optional 처리를 해제하는 키워드이다. (이 때, 원래 optional이 아니었다면 변화가 없다.)
- 다만 여기서 추가로 보았던 점은, 원래 optional이 아닌데 optional로 처리될 수 있는 경우가 있었다.

```ts
type SecondObject = {
  [Key in Exclude<keyof T, K>]?: T[Key];
};
```

- 처음에는 이렇게 접근했었기 때문에, 원래 optional이 아닌데 optional로 처리될 수 있는 경우가 있었다.

## [Medium-2793-Mutable](./medium/2793-mutable.ts)

```ts
type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K];
};
```

- `-readonly`를 통해 `Mapped Type`에서 `readonly`를 명시적으로 제거하는 방법이다.
- Error Case를 보면 Primitive Type에 대해 에러를 발생시키길 원하고 있다.
- 따라서 T는 객체 타입으로 제한하여, 오류를 방지한다.
- 주어진 예제 케이스들에는 없었지만, 객체 내 객체도 Mutable로 전환하려 한다면 다음과 같이 재귀적으로 접근할 수 있을 것, 하지만 `null`과 `undefined`, 함수 타입에 대한 예외 처리가 필요하다.

```ts
type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K] extends object
    ? T[K] extends null | undefined | (...args: any[]) => any
      ? T[K]
      : Mutable<T[K]>
    : T[K];
};
```

## [Medium-2852-OmitByType](./medium/2852-omit-by-type.ts)

```ts
type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};
```

- `T[K] extends U ? never : K`를 통해, U에 해당한다면 해당 key를 제외하는 방식이다.

## [Medium-2946-ObjectEntries](./medium/2946-object-entries.ts)

```ts
type ObjectEntries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T];
```

- 먼저 접근했던 방식은 `["a", "b"][number]`와 같이 접근하여 `"a" | "b"`를 얻어내는 방식이었다.
- 이 방식에 기반하여 Mapped Type을 이용하고, `[K, T[K]]`를 생성했다.
- 예제 케이스들을 보면, 이렇게만 했을 경우 optional key가 존재하는 경우 최종 결과 Union에 undefined가 포함되는 것을 확인할 수 있었다.
- `type ObjectEntriesTest2 = ["key", undefined] | undefined`

```ts
type ObjectEntries<T> = {
  [K in keyof T]-?: [K, T[K]];
}[keyof T];
```

- 예제들을 보면, optional key가 존재하더라도 그 key는 활용되어야 하며, value가 undefined인 경우는 특별한 처리가 필요하지 않음을 알 수 있었다.
- 따라서, 모든 key를 optional로 인식하지 않게 하기 위해 `-?`를 사용했다.
- 이는 `keyof Required<T>`와 같은 효과를 갖는다.

## [Medium-3062-Shift](./medium/3062-shift.ts)
