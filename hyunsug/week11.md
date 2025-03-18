# Week 11

## [Medium-4179-Flip](./medium/4179-flip.ts)

```ts
type Flip<T extends Record<any, any>> = {
  [K in keyof T as T[K] extends keyof any ? T[K] : `${T[K]}`]: K;
};
```

- Object의 key-value를 value-key로 바꾸는 문제
- `No need to support nested objects and values which cannot be object keys such as arrays`
- 문제에 따라 중첩 객체에 대해서, value가 배열인 경우는 고려하지 않는다.
- value가 배열인 경우는 제외하지만 숫자형, 불리언이 존재할 수 있어 그 경우에 대한 처리가 필요하다.
- `Record<any, any>`로 기본적으로 T는 객체로 제한한다.
- `as T[K]`를 이용하여, `PropertyKey`로 쓰일 수 있는 value라면 그대로, 아니라면 템플릿 리터럴로 변환한다.

## [Medium-4182-FibonacciSequence](./medium/4182-fibonacci-sequence.ts)

## [Medium-4260-Nomiwase](./medium/4260-nomiwase.ts)

## [Medium-4426-GreaterThan](./medium/4426-greater-than.ts)

## [Medium-4471-Zip](./medium/4471-zip.ts)

## [Medium-4484-IsTuple](./medium/4484-is-tuple.ts)
