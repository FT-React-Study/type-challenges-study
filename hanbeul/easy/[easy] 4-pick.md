## 4-Pick

### 문제

`T`에서 `K` 프로퍼티만 선택해 새로운 오브젝트 타입을 만드는 내장 제네릭 `Pick<T, K>`을 사용하지 않고 구현하세요.

### 정답

```ts
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
```

### 설명

- `T`는 원본 타입
- `K`는 `T`의 프로퍼티 키 타입 (`extends keyof T`를 활용해 `T`의 프로퍼티 키 타입으로 제한)
- `[P in K]`는 `K`의 각 프로퍼티 키를 순회하며 새로운 타입을 생성
- `T[P]`는 `P` 프로퍼티 키(key)의 값(value)을 가져옴

### 추가 질문

> `as`와 `extends` 차이

- `as`: 타입 단언 or 매핑된 타입 변환
- `extends`: 타입 제약(generic) or 조건부 타입(conditional type) 정의

```ts
// as의 사용(1): 타입 단언
const value: unknown = "hello";
const length = (value as string).length; // 타입 단언

// as의 사용(2): 매핑된 타입 변환
type RenameKeys<T> = {
  [K in keyof T as `new_${string & K}`]: T[K];
};

type Original = { id: number; name: string };
type Renamed = RenameKeys<Original>;
// 결과:
// {
//   new_id: number;
//   new_name: string;
// }
```

```ts
// extends의 사용(1): 타입 제약
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// extends의 사용(2): 조건부 타입 정의
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false
```

> [P in K]란 무엇인가?

- `[]`는 매핑된 타입에서 특정 키를 순회하며 새로운 타입을 생성할 때 사용(index 아님)
- `P`는 매핑된 키를 나타내는 변수
- `in`은 순회(iteration)를 나타내는 키워드로, K의 각 요소를 순회
- `K`는 순회할 키의 집합(K는 일반적으로 keyof T처럼 타입의 키 집합)

- `[P in K]`는 K에 포함된 키를 하나씩 순회하며 새로운 타입의 키를 정의

```ts
type MappedType = {
  [P in K]: ValueType; // 매핑된 타입의 키와 값 정의
};
```

### Reference

- [TypeScript 공식 문서 - 제네릭](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [TypeScript 공식 문서 - 맵드 타입](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
