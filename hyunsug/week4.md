# TS Types - Week 4

## [Medium-15-Last-of-Array](./medium/15-last-of-array.ts)

```ts
type Last<T extends readonly any[]> = T extends [...infer _, infer L]
  ? L
  : never;
```

- rest operator를 사용한다. 마지막 요소를 남기고 나머지 앞부분을 rest로 추출할 수 있다.
- Last of Array이지만 tuple 형태로 주어지는 경우를 함께 처리하기 위해 readonly array를 사용한다.
- 빈 배열이어서 마지막 요소를 추출할 수 없는 경우 never를 반환한다.

## [Medium-16-Pop](./medium/16-pop.ts)

```ts
type Pop<T extends readonly any[]> = T extends [...infer F, infer _] ? F : [];
```

- rest operator 를 사용하여 마지막 요소를 제거하고 나머지 요소를 반환
- 요소가 하나거나 없는 경우 빈 배열을 반환한다.
- `...infer F`는 마지막 요소 전까지의 모든 요소를 캡처하는데 요소가 하나뿐이라면 빈 배열이 된다.
- `infer _`는 마지막 요소를 캡처하는데 요소가 하나뿐이면 그 하나의 요소가 되고, 빈 배열이 된 F가 타입이 된다.
- 원래 빈 배열이라면 infer 구문 두가지가 모두 패턴 매칭에 실패하여 false condition이 된다. 빈 배열 타입을 가지게 한다.

## [Medium-20-Promise-All](./medium/20-promise-all.ts)

- `declare function`: 함수의 타입을 선언하는 것으로, parameter와 return type을 선언할 수 있다.

```ts
// 접근방식 1
declare function PromiseAll<T extends readonly any[]>(
  values: readonly [...T]
): Promise<{
  [K in keyof T]: T[K] extends Promise<infer V> ? V : T[K];
}>;
```

- `[...T]`: 배열의 각 요소를 타입으로 추출한다.
- `values: T`가 아니라 `values: readonly [...T]`로 선언하는 이유:
  - `values: T`: 단순한 배열 타입으로 추론될 수 있음
  - `values: [...T]`: 배열의 각 요소를 타입으로 추출하여 배열을 생성하지만 mutable배열이 되어버린다.
  - `values: readonly [...T]`: 배열의 각 요소를 타입으로 추출하여 배열을 생성하고 readonly 타입으로 추론된다.
- `PromiseAll` 함수는 배열의 각 요소가 Promise인 경우 Promise의 결과 타입을 반환하고, 그렇지 않은 경우 원래 타입을 반환한다.
- `infer V`는 Promise의 결과 타입을 추출하는데, 이 타입은 Promise의 제네릭 타입 매개변수로 추출된다.
- `Promise<infer V>`에서 재귀를 따로 처리하지 않는 이유:
  - 타입스크립트의 `Promise<T>` 타입은 T가 `Promise<U>`인 경우 `Promise<U>`로 추론된다.
  - Promise는 자동으로 unwrap 혹은 flatten 된다.

```ts
// Promise 타입의 평탄화
const p1 = Promise.resolve(Promise.resolve(100));

// p1의 타입이 어떻게 추론되는지 확인
type P1Type = typeof p1; // Promise<number>
```

- T에 명시적인 가변 타입이 주어진 4번째 예제의 경우
  - `Array<number | Promise<number>>`로 명시적인, 가변 배열이 주어짐
  - 튜플이 아니기에 K가 `number`가 되고, T[K]는 `T[number]`가 된다. 따라서 `T[number]`는 `number | Promise<number>` 타입을 가져 최종 타입은 `Promise<number | Promise<number>>`가 된다.

```ts
declare function PromiseAll<T extends readonly any[]>(
  values: readonly [...T]
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}>;
```

- `Awaited<T[K]>`는 `T[K]`가 Promise인 경우 Promise의 결과 타입을 반환하고, 그렇지 않은 경우 원래 타입을 반환한다. (Promise.resolve의 최종 타입)
- 이번에는 예제 3에서 이슈가 보인다. 이는 주어진 배열이 `as const`가 없는 가변 배열이기 떄문이다.

```ts
declare function PromiseAll<
  T extends readonly any[] | [] /* 명시적인 튜플 타입 */
>(
  values: readonly [...T]
): Promise<{
  [K in keyof T]: Awaited<T[K]>;
}>;
```

- [SO 참고자료](https://stackoverflow.com/questions/74848194/how-does-the-type-defination-of-promise-all-work-well-in-this-case)
- `readonly any[]`에 유니언으로 `[]`를 추가하면 타입스크립트가 이를 튜플-like 타입으로 추론하게 된다. (타입으로써의 []는 길이가 0인 튜플 타입을 의미)
- `Awaited`로 인해 프로미스가 평탄화되며, 명시적인 튜플-like 타입으로 인해 가변 배열로 주어진 경우에도 결과가 튜플 타입으로 추론된다.

## [Medium-62-Type-Lookup](./medium/62-type-lookup.ts)

```ts
type LookUp<U, Key> = U extends { type: Key } ? U : never;
```

- 유니언 타입 각각이 가진 `type` 프로퍼티를 참조하여 타입을 추론한다

## [Medium-106-Trim-Left](./medium/106-trim-left.ts)

```ts
type TrimLeft<S> = S extends ` ${infer R}` ? TrimLeft<R> : S;
```

- `infer R`은 문자열에서 공백 하나를 제거한 나머지를 추출한다.
- 이는 공백 문자열만을 제거할 수 있다.

```ts
type Space = " " | "\t" | "\n";
type TrimLeft<S extends string> = S extends `${Space}${infer R}`
  ? TrimLeft<R>
  : S;
```

- 위 방식은 명시적으로 `" "`(공백 문자열), `"\t"`(탭), `"\n"`(줄바꿈) 타입을 Space로 정의한다 (예제에서 주어진 공백은 공백 문자열, \n, \t 세종류가 존재함)
- `${Space}`는 공백 문자열을 의미하며, `${Space}${infer R}`은 공백 문자열 뒤에 문자열이 오는 경우를 의미한다
- 이 경우 공백 문자열을 제거하고 나머지 문자열을 추출하여 재귀적으로 처리한다
- 만약 공백 문자열이 아닌 경우 원래 문자열을 반환한다

## [Medium-108-Trim](./medium/108-trim.ts)

```ts
type Space = " " | "\t" | "\n";
type Trim<S extends string> = S extends `${Space}${infer R}`
  ? Trim<R>
  : S extends `${infer R}${Space}`
  ? Trim<R>
  : S;
```

- 문자열의 앞뒤 공백 문자열을 재귀를 거쳐 제거한다.
