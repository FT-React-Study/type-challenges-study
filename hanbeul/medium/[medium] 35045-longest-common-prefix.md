## [35045] Longest Common Prefix

> View on GitHub: https://tsch.js.org/35045

#### 문제

Write a type, `LongestCommonPrefix` that returns the longest common prefix string amongst a tuple of strings.

If there is no common prefix, return an empty string `""`.

> 예시

```ts
type Common = LongestCommonPrefix<["flower", "flow", "flight"]>;
//   ?^ "fl"

type Uncommon = LongestCommonPrefix<["dog", "racecar", "race"]>;
//   ?^ ""
```

#### 문제 설명

- 튜플에 있는 문자열들의 가장 긴 공통 접두사를 반환하는 타입을 구현
- 공통 접두사가 없으면 빈 문자열 `""`을 반환

#### 시도 1

> 접근 방식

- 첫 번째 문자열을 기준으로, prefix 확장
- 각 prefix마다 모든 문자열이 해당 prefix를 가지는지 확인
- 가장 긴 prefix를 반환

> 코드

```ts
type AllMatch<T extends string[], P extends string> = T extends [
  infer First extends string,
  ...infer Rest extends string[]
]
  ? First extends `${P}${string}`
    ? AllMatch<Rest, P>
    : false
  : true;

type LongestCommonPrefix<
  T extends string[],
  First extends string = T extends [infer F extends string, ...any] ? F : "",
  Prefix extends string = ""
> = First extends `${infer C}${infer Rest}`
  ? AllMatch<T, `${Prefix}${C}`> extends true
    ? LongestCommonPrefix<T, Rest, `${Prefix}${C}`>
    : Prefix
  : Prefix;
```

> 코드 설명

- `First`를 활용해 첫번째 요소 확인
- `First`를 첫 글자와 나머지 글자로 분해
- 분해된 첫 글자를 `Prefix`에 추가, 해당 `Prefix`가 모든 문자열에 존재하는지 확인
- 모든 문자열에 존재하지 않으면 이전 `Prefix`를 반환
- 모든 문자열에 존재하는 경우 `First`의 첫 번째 글자를 제외한 나머지 글자에 대해 재귀 호출
