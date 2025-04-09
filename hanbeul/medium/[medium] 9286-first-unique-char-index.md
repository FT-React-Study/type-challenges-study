## [medium] 9286. First Unique Char Index

#### 문제

> View on GitHub: https://tsch.js.org/9286

Given a string s, find the first non-repeating character in it and return its index. If it does not exist, return -1. (Inspired by [leetcode 387](https://leetcode.com/problems/first-unique-character-in-a-string/))

#### 문제 설명

- 문자열을 받아, 첫 번째 유니크한 문자의 인덱스를 반환
- 유니크한 문자가 없으면 -1 반환

#### 시도 1 (정답)

> 접근 방식

- 문자열을 순회하며, 중복된 문자가 있는지 확인
- 중복된 문자가 있으면 `index`를 반환하고, 아닐 경우 -1 반환

> 코드

```ts
// C가 T에서 유니크한지 확인
type IsUnique<
  T extends string,
  C extends string,
  Count extends unknown[] = []
> = T extends `${infer First}${infer Rest}`
  ? C extends First
    ? IsUnique<Rest, C, [...Count, unknown]>
    : IsUnique<Rest, C, Count>
  : Count["length"] extends 1
  ? true
  : false;

// 각 글자마다 전체 중복검사하면서, 중복 아니면 인덱스 반환
type FirstUniqueCharIndex<
  T extends string,
  Original extends string = T,
  IndexArr extends unknown[] = []
> = T extends `${infer First}${infer Rest}`
  ? IsUnique<Original, First> extends true
    ? IndexArr["length"]
    : FirstUniqueCharIndex<Rest, Original, [...IndexArr, unknown]>
  : -1;
```

> 코드 설명

- `IsUnique` 타입은 문자열에서 유니크한 문자가 있는지 확인
- `C`는 확인할 문자(Character), `T`를 순회하며 `C`가 `T`의 요소인지 `infer`를 활용해 확인
- `Count`는 중복 횟수를 카운트하는 배열. 중복되면 배열에 요소를 추가하고, 중복되지 않으면 배열에 요소를 추가하지 않음 (중복 횟수가 1인지 확인)
- `FirstUniqueCharIndex` 타입은 문자열을 순회하며, `IsUnique` 타입을 활용해 유니크한 문자인지 확인
- 유니크한 문자일 경우 `IndexArr` 배열의 길이를 반환, 아닐 경우 재귀 호출
