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

## [Medium-2852-OmitByType](./medium/2852-omit-by-type.ts)

## [Medium-2946-ObjectEntries](./medium/2946-object-entries.ts)

## [Medium-3062-Shift](./medium/3062-shift.ts)
