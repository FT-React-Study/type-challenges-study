# TS Types - Week 1

## Easy-4-Pick

- **in** - Mapped Type 안에서 이용될 시, 객체의 키를 순회하며 새로운 타입을 정의하기 위해 이용된다.
  - [MappedType](https://www.typescriptlang.org/ko/docs/handbook/2/mapped-types.html)
- **extends** - `A extends B`와 같이 사용될 시, A가 B의 부분집합을 만족해야함을 의미한다.
- `[Key in K]` - K의 각 값을 순회하며 새로운 객체 타입의 key로 이용하기 위해 사용되었다.
- `T[Key]` - T라는 타입의 객체에서 Key에 해당하는 value의 타입을 지정한다. K가 extends를 통해 `keyof T`를 만족하므로 `Key`는 T 객체의 key이다.

```ts
type MyPick<T, K extends keyof T> = {
  [Key in K]: T[Key];
};
```
