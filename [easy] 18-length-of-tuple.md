## 18-Length of Tuple

### 문제

배열(튜플)을 받아 길이를 반환하는 제네릭 Length<T>를 구현하세요.

### 정답

```ts
type Length<T extends readonly any[]> = T["length"];
```

### 설명

- `T extends readonly any[]`는 튜플 `T`가 읽기 전용 배열이라는 것을 확인
- `T["length"]`는 튜플 `T`의 길이를 반환

### 추가 질문

> 왜 읽기 전용 배열이어야 하는가?

- 우선, 예시에서 주어진 튜플은 모두 읽기 전용 배열(as const)이다.
- 그렇다면 as const와 readonly 모두 제거하면 어떻게 될까?

```ts
type Length<T extends any[]> = T["length"]; // readonly 제거

const tesla = ["tesla", "model 3", "model X", "model Y"]; // as const 제거
```

- 이 경우 `Expect<Equal<Length<typeof tesla>, 4>>`와 `Expect<Equal<Length<typeof spaceX>, 5>>`가 false가 된다.
- TypeScript에서 배열 리터럴(`const tesla = ['tesla', 'model 3', 'model X', 'model Y']`)은 기본적으로 `수정 가능한 배열(string[])`로 간주됩니다. 즉, `typeof tesla`의 타입은 `string[]`이다.

```ts
type TeslaType = string[]; // 배열의 요소 타입은 string, 길이는 고정되지 않음
type TeslaTypeAsConst = readonly ["tesla", "model 3", "model X", "model Y"]; // 배열의 요소 타입은 string, 길이는 4
```

- `Length<T>`는 배열 타입에서 `length` 프로퍼티를 참조한다. 하지만 배열이 단순히 `string[]`로 추론되면, 배열의 길이에 대한 정보를 포함하지 않음.
- 따라서 `Length<typeof tesla>`는 정확히 4라는 값 타입이 아니라, `number` 타입으로 추론됨

### Reference
