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
        [Key in keyof T as Key extends K ? Key : never]?: T[Key];
      } & {
        [Key in Exclude<keyof T, K>]: T[Key];
      }
    >;
```

- `K`가 주어지지 않은 경우 `never`로 처리하도록 기본값을 설정하고, 검증 후 `Partial`로 문제 의도에 따라 모든 key에 대해 optional 처리를 한다.
- 그렇지 않은 경우, `T`의 key인 `K`에 대해서는 optional 처리를 한 object와, 그렇지 않은 원래 상태를 그대로 유지하는 object를 만들고 intersection한다.
- 그리고 추가적인 타입 `IntersectionToObj`를 이용하여 합쳐진 Obj type을 생성한다.

## [Medium-2759-RequiredByKeys](./medium/2759-required-by-keys.ts)

## [Medium-2793-Mutable](./medium/2793-mutable.ts)

## [Medium-2852-OmitByType](./medium/2852-omit-by-type.ts)

## [Medium-2946-ObjectEntries](./medium/2946-object-entries.ts)

## [Medium-3062-Shift](./medium/3062-shift.ts)
