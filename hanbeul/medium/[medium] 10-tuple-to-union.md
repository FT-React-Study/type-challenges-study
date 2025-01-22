## 10-Tuple to Union

> View on GitHub: https://tsch.js.org/10

## 문제

튜플 값으로 유니온 타입을 생성하는 제네릭 `TupleToUnion<T>`를 구현하세요.

## 정답

```ts
type TupleToUnion<T extends readonly any[]> = T[number];
```

## 해설

- 11-tuple-to-object에서 사용한 `T[number]`을 활용해 union 타입 반환

## 추가 질문

## Reference

- [블로그 글 - Tuple to Object](https://velog.io/@hayou/TS-Type-Challenges-%EC%8A%A4%ED%84%B0%EB%94%94#3-easy-tuple-to-object)
