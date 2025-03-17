# [medium] 4182-fibonacci

#### 문제

숫자 `T`를 입력받아 해당하는 피보나치 수를 반환하는 제네릭 타입 `Fibonacci<T>`를 구현하세요.
수열은 다음과 같이 시작됩니다:

```typescript
1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ...
```

> 예시

```typescript
type Result1 = Fibonacci<3>; // 2
type Result2 = Fibonacci<8>; // 21
```

#### 시도 1 (정답)

> 접근 방식

- 재귀를 통해 피보나치 수열을 구현
- 숫자 더하기 연산이 안되니까 배열에 뭔가를 넣고, 그 배열의 length를 이용해보자

> 코드

```typescript
type Fibonacci<
  T extends number,
  Fibo1 extends any[] = ["f"],
  Fibo2 extends any[] = ["f"],
  Count extends any[] = ["f", "f", "f"]
> = T extends 1 | 2
  ? 1
  : Count["length"] extends T
  ? [...Fibo1, ...Fibo2]["length"]
  : Fibonacci<T, Fibo2, [...Fibo1, ...Fibo2], [...Count, "f"]>;
```

> 코드 설명

- `T extends 1 | 2` 형태로 초기 조건 설정(`T`가 1, 2일 때 항상 1)
- `T`가 3 이상일 때 `Count`의 `length`가 `T`와 같아지면 앞의 두 배열을 합한 배열의 `length`를 반환
- 만약 `Count`의 `length`가 `T`보다 작으면, 뒤의 배열을 앞의 배열에 할당하고, 뒤의 배열은 앞의 배열과 뒤의 배열을 합친 배열을 할당
- 이후 `Count`에 `"f"`를 추가하여 재귀 호출
