# Week 15

## [Medium-9898-Appear only once](./medium/9898-appear-only-once.ts)

- 최초에는 `Once`, `Repeated` 두 제너릭을 이용하여 일단 접근했다.
- Once에 일단 추가하고 Once에 있다면 Repeated에 추가하고, 최종적으로 Once에 있는 요소들 중 Repeated에 있는 요소들을 제외하고 반환하는 방식을 생각했다.
- 이 방식으로 구현할 때, `RemoveFromArray<Once, Repeated[number]>` 형태를 구상했으나,
- 해당 헬퍼 타입 내에서 `Same<A, B>`를 이용할 때, B에 들어가는 `Repeated[number]`가 분배되는 게 아니라 유니언 자체로 타입 비교가 발생하여 원하는 해결을 하지는 못했다.

```ts
type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B
  ? 1
  : 2
  ? true
  : false;

type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? Same<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type FindEles<
  T extends any[],
  Unique extends any[] = [],
  Repeated extends any[] = []
> = T extends [infer F, ...infer R]
  ? Includes<R, F> extends true
    ? FindEles<R, Unique, [...Repeated, F]>
    : Includes<Repeated, F> extends true
    ? FindEles<R, Unique, Repeated>
    : FindEles<R, [...Unique, F], Repeated>
  : Unique;
```

- 이전에 이용한 적이 있던 `Includes` 타입을 이용하는 방식이 생각나 이를 활용한 접근을 다시 진행했다.
- 먼저 `F`, `R`로 분리하는 지점은 동일하나, 우선 남아있는 배열에 F가 중복되어 나타나는지를 확인한다.
- 중복 원소라면 Repeated에 추가하고, 중복되지 않는다면 Unique에 추가한다.
- 잘라낸 앞 원소가 뒤에 나타나지 않는다면 그 다음은 `Repeated`와 `F`를 비교하여 중복을 확인한다.
- 여기서 중복이라면 이미 `Repeated`에 추가되어 있으므로, 다음 순환을 진행하고 그렇지 않다면 유니크 원소로 추가한다.
- 배열이 빌 때까지 이 과정을 반복하면 최종적으로 유니크한 원소들만 남게 된다.

## [Medium-9989-Count Element Number To Object](./medium/9989-count-element-number-to-object.ts)

## [Medium-10969-Integer](./medium/10969-integer.ts)

## [Medium-16259-ToPrimitive](./medium/16259-to-primitive.ts)

## [Medium-17973-DeepMutable](./medium/17973-deep-mutable.ts)

## [Medium-18142-All](./medium/18142-all.ts)
