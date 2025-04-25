## [medium] 21104. Find All

> View on github: https://tsch.js.org/21104

#### 문제

Given a pattern string P and a text string T, implement the type `FindAll<T, P>` that returns an Array that contains all indices (0-indexed) from T where P matches.

#### 문제 설명

- 텍스트 문자열 `T`와 패턴 문자열 `P`를 받아, `P`가 `T`에 존재하는 모든 인덱스를 배열로 반환

#### 시도 1

> 접근 방식

- 템플릿 리터럴로 P가 존재하는지 확인, 존재할 경우 index를 구해서 리턴 배열에 추가
- index는 left 문자열의 길이를 재면 되지 않을까?
- 이후 P 뒷쪽의 rest 문자열을 재귀 처리

> 코드

```ts
type GetIndex<
  T extends string,
  LengthArr extends unknown[] = []
> = T extends `${infer _}${infer Rest}`
  ? GetIndex<Rest, [unknown, ...LengthArr]>
  : LengthArr["length"];

type FindAll<
  T extends string,
  P extends string
> = T extends `${infer Left}${P}${infer Rest}`
  ? [GetIndex<Left>, ...FindAll<Rest, P>]
  : [];
```

> 코드 설명

- `${infer Left}${P}${infer Rest}`를 활용해 P가 존재하는지 확인
- `P`가 존재할 경우, `Left`의 길이를 리턴하고, 이후 `Rest`에 대해 재귀 처리
- `P`가 존재하지 않을 경우, 빈 배열 반환

> 실패 이유

- 뒷쪽의 `rest` 문자열만 재귀처리하니까, 두번째 요소에 대해서는 뒷쪽(`rest` 내)의 index를 구함
- 누적으로 더할 방법을 고민해봐야 함
- 하지만 결국 `rest`로 분리하게 되면, `AAAA`, `AA`를 통과를 못시킬듯

#### 시도 2 (정답)

> 접근 방식

- `T`의 한 글자씩 순회하면서, `P`의 첫 글자와 같으면 비교
- 비교 성공시 `index` 리턴 배열에 추가

> 코드

```ts
type FindAll<
  T extends string,
  P extends string,
  IndexArr extends unknown[] = []
> = T extends `${infer TFirst}${infer TRest}`
  ? P extends `${TFirst}${infer PRest}`
    ? TRest extends `${PRest}${infer _}`
      ? [IndexArr["length"], ...FindAll<TRest, P, [...IndexArr, unknown]>]
      : [...FindAll<TRest, P, [...IndexArr, unknown]>]
    : [...FindAll<TRest, P, [...IndexArr, unknown]>]
  : [];
```

> 코드 설명

- `${infer TFirst}${infer TRest}`를 활용해 `T`의 한 글자씩 순회
- `P`의 첫 글자와 같으면(`${TFirst}${infer PRest}`), `TRest`가 `P` 문자열을 포함하는지 확인
- 그럴 경우, 해당 `index`를 리턴 배열에 추가
- 아닐 경우, 해당 글자는 무시하고 다음 글자로 넘어감
- 모든 글자를 순회하면 빈 배열 반환
