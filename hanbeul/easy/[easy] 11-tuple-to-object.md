## 11-Tuple to Object

### 문제

배열(튜플)을 받아, 각 원소의 값을 key/value로 갖는 오브젝트 타입을 반환하는 타입을 구현하세요.

### 정답

```ts
type TupleToObject<T extends readonly any[]> = { [P in T[number]]: P };
```

### 설명

- `T`는 배열(튜플) 타입
- `T[number]`는 배열 `T`의 모든 요소 타입을 나타냄 (배열 `T`의 인덱스에 있는 모든 타입을 집합으로 반환)
- `[P in T[number]]`는 `T[number]`의 각 원소를 순회하며 새로운 타입을 생성

### 추가 질문

> `[P in T]`가 안되는 이유

- 매핑된 타입에서 [P in ...] 구문은 키(key)를 순회하는 역할을 하며, P는 반드시 "키로 사용할 수 있는 값"이어야 함
- `T`는 `['tesla', 'model 3', 'model X']`라는 배열의 "전체"를 가리킴

```ts
type T = ["tesla", "model 3", "model X"];
```

- 매핑된 타입에서 키는 배열 전체가 될 수 없고, 반드시 키로 사용할 수 있는 타입이어야 함

- 반면, `T[number]`는 배열 `T`의 요소 타입만을 추출하여 배열의 모든 요소를 하나의 집합으로 표현
- 배열 T의 각 요소가 P로 순회될 수 있도록 만들어 줌

```ts
type T = ["tesla", "model 3", "model X"];
type TElement = T[number]; // 'tesla' | 'model 3' | 'model X'
```

### Reference

- [Typescript 공식 문서 - Indexed-Access-Types](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
