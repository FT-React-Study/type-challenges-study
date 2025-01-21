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

## [Medium-8-Readonly-2](./medium/8-readonly-2.ts)

## [Medium-9-Deep-Readonly](./medium/9-deep-readonly.ts)

## [Medium-10-Tuple-to-Union](./medium/10-tuple-to-union.ts)

## [Medium-12-Chainable-Options](./medium/12-chainable-options.ts)
