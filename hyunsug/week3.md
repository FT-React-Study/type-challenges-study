# TS Types - Week 3

## [Medium-2-Return-Type](./medium/2-return-type.ts)

```ts
type MyReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer K
  ? K
  : never;
```

`ReturnType<T>`는 함수 T의 리턴값의 타입을 반환하는 타입이다.  
T는 함수여야 하기에 `T extends (...args: any[]) => any` 를 만족해야 한다  
여기에 이어서 함수의 리턴 타입을 `infer K`로 추론하여 K를 리턴하도록 한다.  
이 때, 함수의 리턴 타입이 K로 타입 추론되며 언제나 반환 타입을 추론하게 되어 K를 리턴하기에  
false condition은 any여도 never여도 상관없다고 볼 수 있다. infer를 사용하기 위해 존재하는 형태로 볼 수 있다

## [Medium-3-Omit](./medium/3-omit.ts)

```ts
type MyOmit<T extends object, U extends keyof T> = {
  [K in Exclude<U, keyof T>]: T[K];
};
```

- T는 객체 타입이어야 함
- U는 T 객체의 key값의 유니온의 subset이어야 함
- Exclude를 통해 T의 키 유니온에서 U를 제외함 (이전 easy에서 사용한 MyExclude를 사용해도 됨)

### 다른 솔루션 참고 - `as`를 사용한 `Key Remapping`

```ts
type MyOmit<T extends object, U extends keyof T> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};
```

- K는 T의 key 유니온의 서브셋이어야 한다
- `as K extends U`를 통해 U의 서브셋이라면 제외한다
- 여기서 사용된 `as`를 이용하면 새로운 타입을 만들면서 키의 리네이밍이 가능해진다.

```ts
type RenameKeys<T> = {
  [K in keyof T as `prefix_${string & K}`]: T[K];
};
```

- 이 때 주의할 점은 `${string & K}` 부분이다.
- JS에서 Object의 Key는 string과 Symbol타입으로 존재한다.
- Symbol은 문자열과 합쳐질 수 없기에 string & K 타입 인터섹션을 통해 변환 가능한 키만 필터링하여 리네이밍을 하게 된다. 결과적으로 문자열로 전환이 가능한 키만 남아 리네이밍된 타입이 생성된다.

### Type Intersection ("_교집합_") `&`

- 객체 타입에서는 두 타입의 모든 프로퍼티를 병합한다.

```ts
interface A {
  a: number;
}

interface B {
  b: string;
}

type AB = A & B;

// AB = { a: number; b: string };
```

- 동일한 key가 있다면 해당 key의 타입은 타입의 교집합이 된다.
- 호환되지 않는 타입이 있다면 `never`가 된다.

```ts
interface A {
  key: string;
}

interface B {
  key: "specific";
}

type AB = A & B;
// AB = { key: "specific" } (string & "specific" => "specific")
```

```ts
interface A {
  key: string;
}

interface B {
  key: number;
}

type AB = A & B;
// AB = { key: never } (string & number => never)
```

- 타입 인터섹션은 교집합, 즉 두 타입의 서브셋으로 좁혀진다
- 원시 타입이라면 교집합은 공통으로 가능한 값들로 평가된다
- 키 리맵핑 과정의 `string & K`에서는 원시타입의 인터섹션이 된다.

## [Medium-8-Readonly-2](./medium/8-readonly-2.ts)

```ts
type MyReadonly2<T extends object, U extends keyof T> = {
  [K in keyof T as K extends U ? never : K]: T[K];
} & {
  readonly [K in keyof T as K extends U ? K : never]: T[K];
};
```

- 단순하게, readonly를 적용한 object와 readonly가 적용되지 않은 object를 Intersection하는 형태로 작성

## [Medium-9-Deep-Readonly](./medium/9-deep-readonly.ts)

```ts
type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>;
    }
  : T;
```

- 함수 타입의 경우 readonly를 적용 후 함수 타입 자체를 반환 `(...args: any[]) => any`
- 여기서 함수타입 체크에서 `Function`은 생성자로 클래스 등을 포함하므로 함수 타입은 화살표 형태를 많이 사용한다고 함
- 객체 타입의 경우 key를 기반으로 다시 객체 타입의 상속을 받는 value에 대해 재귀를 진행
- 이외는 그대로 반환

- 예제 유니언 타입의 경우 X2: TS 분배법칙을 통해 각각 처리 후 유니언화
- 예제 X1에서의 경우
  - 함수: 함수 처리로 통과
  - 배열/튜플: 배열과 튜플 또한 객체 상속을 받기에 정상 적용 됨

## [Medium-10-Tuple-to-Union](./medium/10-tuple-to-union.ts)

```ts
type TupleToUnion<T> = T extends ReadonlyArray<infer U> ? U : never;
```

- `T extends ReadonlyArray<infer U>`를 통해 ReadonlyArray(Tuple을 포함함 Array)의 value 유니언 값을 U로 추출하여 반환
- `T extends Array<infer U>`일 시 T는 튜플이 아닌 일반 배열임을 의미
  - 예시: `const testArr = [123, "456", false] as const`를 사용하면 `TupleToUnion<typeof testArr>`이 `never` 타입으로 나타난다.

## [Medium-12-Chainable-Options](./medium/12-chainable-options.ts)

```ts
type Chainable<T = {}> = {
  option: <K extends string, V extends any>(
    key: K,
    value: V
  ) => Chainable<T & { [Key in K]: V }>;
  get: () => T;
};
```

- option은 Chainable을 반환해야 하며 받은 key-value 쌍을 갖게 해야 한다.
- get은 Chainable을 반환해야 한다.

- 예제 2, 3를 통해 갖춰야 할 추가적인 조건은 다음과 같다.
  - 동일 key가 들어온다면 에러여야 한다
  - 동일 key가 들어오지만 value의 타입이 다른 경우 타입은 변경해야 한다.

```ts
type Chainable<T = {}> = {
  option: <K extends string, V>(
    key: Exclude<K, keyof T>,
    value: V
  ) => Chainable<Omit<T, K> & Record<K, V>>;
  get: () => T;
};
```

- "동일한 key 값은 전달되어서는 안된다" 이 타입 에러를 발생시키기 위해 `Exclude<K, keyof T>`를 사용한다.

  - 파라미터에 이미 전달되었던 "name"이라는 key가 전달되었을 때 이는 타입 에러를 발생시킨다.

- `Omit<T, K> & Record<K, V>` name이 number로 바뀌는 것을 본다면 key의 value는 override가 가능함을 알 수 있다.
  따라서, K라는 key를 T에서 제거하고 `Record<K, V>` 인터섹션을 진행한다.

- ParameterType과 ReturnType이 독립적으로 적용되는 것을 이해하는데 시간이 걸렸던 문항
  > never로 평가된 K는 return 타입에서 이용될 수 있는가? 라는 질문에 답을 얻는 시간이 걸렸다.
