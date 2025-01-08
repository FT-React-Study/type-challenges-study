## 7-Readonly

> View on GitHub: https://tsch.js.org/7

### 문제

`T`에서 모든 프로퍼티를 읽기 전용으로 만드는 내장 제네릭 `Readonly<T>`을 사용하지 않고 구현하세요.

### 정답

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

### 설명

- `[P in keyof T]`: `T`의 모든 프로퍼티 키를 순회하며 새로운 타입을 생성
- `readonly`: 프로퍼티를 읽기 전용으로 만듦
- `T[P]`는 `P` 프로퍼티 키(key)의 값(value)을 가져옴

### 추가 질문

> 'readonly' 키워드는 무엇인가?

- `Typescript` 고유의 `Type Modifier`
- 타입 정의 시 특정 프로퍼티를 읽기 전용으로 선언할 때 사용
- 읽기 전용 프로퍼티는 할당 불가능
- 객체 타입의 프로퍼티, 배열, 매핑된 타입에 적용 가능
- 런타임이 아닌 컴파일 타임에만 동작

```ts
// 객체 타입의 프로퍼티
interface User {
  readonly id: number;
  name: string;
}

const user: User = { id: 1, name: "Hayou" };
user.id = 2; // 오류: 'id'는 읽기 전용 속성입니다.

// 배열
const numbers: readonly number[] = [1, 2, 3];
numbers[0] = 4; // 오류: 읽기 전용 배열에서는 값을 변경할 수 없습니다.
numbers.push(4); // 오류: 읽기 전용 배열에서는 요소를 추가할 수 없습니다.

// 매핑된 타입
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  id: number;
  name: string;
}

type ReadonlyUser = MyReadonly<User>;
const user: ReadonlyUser = { id: 1, name: "Hayou" };
user.id = 2; // 오류: 'id'는 읽기 전용 속성입니다.
```

### Reference

- [TypeScript 공식 문서 - readonly and const](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#readonly-and-const)
