## [medium] 5821. Map Types

> View on GitHub: https://tsch.js.org/5821

#### 문제

Implement `MapTypes<T, R>` which will transform types in object `T` to different types defined by type `R` which has the following structure

```ts
type StringToNumber = {
  mapFrom: string; // value of key which value is string
  mapTo: number; // will be transformed for number
};
```

> Examples:

```ts
type StringToNumber = { mapFrom: string; mapTo: number };
MapTypes<{ iWillBeANumberOneDay: string }, StringToNumber>; // gives { iWillBeANumberOneDay: number; }

// Be aware that user can provide a union of types:
type StringToNumber = { mapFrom: string; mapTo: number };
type StringToDate = { mapFrom: string; mapTo: Date };
MapTypes<{ iWillBeNumberOrDate: string }, StringToDate | StringToNumber>; // gives { iWillBeNumberOrDate: number | Date; }

// If the type doesn't exist in our map, leave it as it was:
type StringToNumber = { mapFrom: string; mapTo: number };
MapTypes<
  { iWillBeANumberOneDay: string; iWillStayTheSame: Function },
  StringToNumber
>; // // gives { iWillBeANumberOneDay: number, iWillStayTheSame: Function }
```

#### 문제 설명

- `MapTypes<T, R>` 타입은 객체 `T`의 타입을 변환하는 타입
- `R`은 변환 규칙을 정의하는 타입
- `R`의 구조는 다음과 같음 (`mapFrom`과 `mapTo`가 있음)
- `R`은 여러 개의 타입을 유니온으로 받을 수 있음
- `R`에 없는 타입은 그대로 반환

#### 시도 1

- 객체 `T`를 순회하면서, `T[K]`가 `R`의 `mapFrom`과 같은 타입인지 확인
- 같으면 `mapTo` 타입으로 변환
- 같지 않으면 그대로 반환

> 코드

```ts
type MyEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

// mapFrom과 mapTo를 어떻게 꺼내오지?
// type MapTypes<T, R> = {
//   [K in keyof T]: R extends R
//     ? MyEqual<R["mapFrom"], K> extends true
//       ? R["mapTo"]
//       : T[K]
//     : T[K];
// };

// infer로 mapFrom과 mapTo를 꺼내옴
type MapTypes<T, R> = {
  [K in keyof T]: R extends { mapFrom: infer From; mapTo: infer To }
    ? T[K] extends From
      ? To
      : T[K]
    : never;
};
```

> 실패 이유

- 마지막 예제 실패

```ts
type example = MapTypes<
  { name: string; date: Date },
  { mapFrom: string; mapTo: boolean } | { mapFrom: Date; mapTo: string }
>;
```

- R 모두를 돌면서 각각의 결과의 유니온이 들어옴

#### 시도 2 (답지 확인)

> 접근 방식

- 유니온 타입을 순회하면서 변환한 것, 변환하지 않은 것이 유니온으로 들어오지 못하게 처리

> 코드

```ts
type MapTypes<T, R extends { mapFrom: any; mapTo: any }> = {
  [K in keyof T]: T[K] extends R["mapFrom"]
    ? R extends { mapFrom: T[K] }
      ? R["mapTo"]
      : never
    : T[K];
};
```

> 코드 설명

- 우선 `R`을 `{ mapFrom: any; mapTo: any }`로 제한
- `T[K]`와 `R["mapFrom"]`를 비교
- 만약 `extends`가 가능하다면, `R` 중 `{ mapFrom: T[K] }`에 `extends` 가능한 요소만 남김(만약 `extends`가 불가능하다면, `never` 반환)
- 남은 요소의 `mapTo` 타입으로 변환
- 만약 `extends`가 불가능하다면, `T[K]` 그대로 반환
