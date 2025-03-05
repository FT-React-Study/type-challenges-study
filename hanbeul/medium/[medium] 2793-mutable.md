# 2793 - Mutable

## 문제

제네릭 `Mutable<T>`를 구현하세요. 이는 `T`의 모든 속성을 가변(mutable)하게 만듭니다 (readonly가 아니게).

예시:

```typescript
interface Todo {
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
}

type MutableTodo = Mutable<Todo>; // { title: string; description: string; completed: boolean; }
```

## 풀이

### 시도 1

> 접근 방식

- 키 순회 및 리맵핑 과정에서 조건부 처리로 해볼 수 있지 않을까?
- 구현 불가능

### 시도 2

> 접근 방식

- 아예 키값들을 따로 떼오고, 그걸 순회하며 뭔가 처리해보자
- `-readonly`라는 키워드가 있네

> 코드

```ts
type Mutable<T, K extends keyof T = keyof T> = {
  -readonly [P in keyof T as P extends K ? P : never]: T[P];
};
```

> 실패 이유

- 리스트 타입에 대해서 처리 불가능

### 시도 3

> 접근 방식

- 리스트 먼저 처리 후 나머지 타입에 대해 처리

> 코드

```ts
type Mutable<T> = T extends readonly [...infer R]
  ? [...R]
  : { -readonly [P in keyof T]: T[P] };
```

> 실패 이유

- 타입 에러 처리 불가능

### 시도 4 (성공)

> 접근 방식

- 리스트나 객체가 아닌 값에 대해 에러 처리를 해줘야하기 때문에, object 타입만 받도록 설정

> 코드

```ts
type Mutable<T extends object> = T extends readonly [...infer R]
  ? [...R]
  : { -readonly [P in keyof T]: T[P] };
```

> 코드 설명

- 만약 `T`가 `readonly` 리스트 타입이라면, 해당 원소들을 스프레드 연산자로 풀어서 반환
- 만약 `T`가 `readonly` 객체 타입이라면, 해당 속성들을 순회하며 `-readonly` 키워드를 붙여서 반환
