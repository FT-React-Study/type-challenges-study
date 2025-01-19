## 3-Omit

> View on GitHub: https://tsch.js.org/3

### 문제

`T`에서 `K` 프로퍼티만 제거해 새로운 오브젝트 타입을 만드는 내장 제네릭 `Omit<T, K>`를 이를 사용하지 않고 구현하세요.

### 정답

```ts
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
```

### 설명

- 우선 `K extends keyof T`를 통해 `K`가 `T`의 키 값임을 명시
- `P in keyof T`를 통해 `T`의 키 값들을 순회
- `as`를 통해 `P`가 `K`에 포함되지 않는 경우에만 `P`를 반환
- `never`는 타입 시스템에서 제거 되기 때문에, `P`가 `K`에 포함되지 않는 경우에만 `P: T[P]`가 반환 됨

### 추가 질문

> `as` 딥 다이브

- `as`를 활용한 키 리맵핑은 타입스크립트 4.1 버전에 추가된 기능
- 매핑된 타입에 `as` 절을 사용해서 매핑된 타입의 키를 다시 매핑할 수 있음

```ts
type MappedTypeWithNewProperties<Type> = {
  [Properties in keyof Type as NewKeyType]: Type[Properties];
};
```

- 템플릿 리터럴 타입과 같은 기능을 활용해서 이전 프로퍼티에서 새로운 프로퍼티 이름을 만들 수 있음

```ts
type Getters<Type> = {
  [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property];
};

interface Person {
  name: string;
  age: number;
  location: string;
}

type LazyPerson = Getters<Person>;
// type LazyPerson = {
//     getName: () => string;
//     getAge: () => number;
//     getLocation: () => string;
// }
```

- 정답에서 사용했듯이 조건부 타입을 통해 `never`를 생성해서 키를 필터링할 수 있음
- `string | number | symbol` 의 조합뿐만 아니라 모든 타입의 조합을 임의로 매핑할 수 있음

### Reference

- [TypeScript 공식 문서 - Omit](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)
- [TypeScript 공식 문서 - Key Remapping via `as`](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html#key-remapping-via-as)
- [Github Answer](https://github.com/type-challenges/type-challenges/issues/448)
