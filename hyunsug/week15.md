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

```ts
type DeepFlat<T extends any[]> = T extends [infer F, ...infer Rest]
  ? F extends any[]
    ? [...DeepFlat<F>, ...DeepFlat<Rest>]
    : [F, ...DeepFlat<Rest>]
  : [];

type GetObjectWithLength<T extends { [key: keyof any]: readonly unknown[] }> = {
  [key in keyof T]: T[key] extends readonly unknown[]
    ? T[key]["length"]
    : never;
};

type CountElementNumberToObject<
  T extends any[],
  FT extends any[] = DeepFlat<T>,
  Base extends { [key: keyof any]: unknown[] } = { [key in FT[number]]: [] }
> = T extends [never]
  ? {}
  : FT extends [infer F, ...infer Rest]
  ? F extends keyof Base
    ? CountElementNumberToObject<
        [],
        Rest,
        {
          [key in keyof Base]: key extends F
            ? [...Base[key], unknown]
            : Base[key];
        }
      >
    : CountElementNumberToObject<[], Rest, Base>
  : GetObjectWithLength<Base>;
```

- 예제들을 보고 우선 `[T] extends [never]`로 never 단일 검증을 처리하려 했으나, T가 `[never]`이기에 이 방식으로는
  `[[never]] extends [never]` 형태로 타입 비교가 되어 오류가 있었다.
- 배열이 중첩되는 형태가 예제에 존재했기 때문에 이터레이션의 편의를 위해 `DeepFlat` 타입을 이용하여 배열을 펼쳤다.
- 기본 흐름은 `FT`에 펼쳐진 배열을 담고 `T`는 더이상 사용하지 않으며, `Base`에는 펼쳐진 요소들을 key로 가지며 나온 횟수를
  `unknown`이 반복되는 배열로 그 횟수를 담도록 했다.
- 마지막에 헬퍼 타입을 하나 추가하여, 각 key에 대한 배열의 길이를 이용하여 원하는 객체 타입을 반환하도록 했다.

## [Medium-10969-Integer](./medium/10969-integer.ts)

```ts
type Same<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? 1
  : 2;

type StringToUnion<T extends string> = T extends `${infer First}${infer Rest}`
  ? First | StringToUnion<Rest>
  : never;

type IsOnlyZero<T extends string> = StringToUnion<T> extends "0" ? true : false;

type Integer<T extends string | number> = Same<T, number> extends true
  ? never
  : `${T}` extends `${infer IntegerPart}.${infer DecimalPart}`
  ? IsOnlyZero<DecimalPart> extends true
    ? IntegerPart
    : never
  : T;
```

- 예제들을 확인하고 고려해야겠다고 생각한 점은 다음 두가지다
- `number` 타입으로 나타나는 일반 숫자(숫자 리터럴 타입이 아닌)인 경우를 제거하는 케이스,
- 소수점을 가지되 정수인지 실수인지를 판별하는 케이스
- 따라서 지속적으로 엄밀한 타입 비교를 위해 이용하는 `Same` 타입을 이용하여 `number` 타입으로 나타나는 경우를 제거했다
- 그리고 문자열로 변환한 T를 템플릿 리터럴 패턴 매칭을 이용하여 정수부, 소수부로 나누고 소수부가 0으로만 이루어졌는지를 판별하도록 했다
- 이를 위해 `StringToUnion` 타입을 이용하여, 0만으로 이루어졌다면 0 하나의 유니언이 될 테니 이를 이용했다
- 따라서, 소수부가 0으로만 이루어진 경우 정수부를 반환하고
- `number`타입이 아닌 숫자 리터럴 타입이고, 패턴매칭에 잡히지 않는 소수부가 없는 경우 그대로 반환하도록 했다

## [Medium-16259-ToPrimitive](./medium/16259-to-primitive.ts)

```ts
type ToPrimitive<T> = T extends (...args: any[]) => any
  ? Function
  : T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T extends readonly any[]
  ? { [K in keyof T]: ToPrimitive<T[K]> }
  : T extends object
  ? { [K in keyof T]: ToPrimitive<T[K]> }
  : T;
```

- 그냥 `Function`부터 하나씩 거쳐가면서 마지막에 배열과 객체 타입을 순회하도록 했다
- 배열의 경우 `readonly`가 붙은 경우를 함께 처리하려면 `readonly any[]` 혹은 `readonly unknown[]` 타입을 extends 하는지 확인해야 하기에 그렇게 진행했다

## [Medium-17973-DeepMutable](./medium/17973-deep-mutable.ts)

## [Medium-18142-All](./medium/18142-all.ts)

```

```
