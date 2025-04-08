# Week 14

## [Medium-8767-Combination](./medium/8767-combination.ts)

```ts
type Combination<T extends string[], U = T[number], U2 = U> = U2 extends string
  ? U2 | `${U2} ${Combination<[], Exclude<U, U2>>}`
  : never;
```

- 지난 [296-permutation](./medium/296-permutation.ts) 문제와 유사한 형태라고 생각했다
- 순열과 조합의 차이는 순서에 있다, Combination은 순서에 따라 서로 다른 결과가 된다
- 기본적으로는 순열과 같이 각 원소를 분배하는 방식으로 접근해야 했다.
- 원본 배열을 복제하여 각 원소를 분배하는 방식을 취하기로 했다.
- 처음에는 `U = T[number]` 하나의 추가 제너릭을 이용하여 원본 배열의 원소를 `U extends string`으로 분배하는 방식을 생각했다.
- 하지만 이 방식은 참 조건에서 T가 다시 주어져 탈출조건을 만족시킬 수 없는 문제가 있었다.
- 추가로 알게된 내용은 `U`, `U2`가 동일한 유니언 값을 갖지만, 타입 추론 과정에서 U2는 새로운 타입 변수로 추론되어 템플릿 리터럴과 함께 존재해도 분배가 일어나지만, 원본을 참조하는 `U`는 분배가 일어나지 않고 유니언 타입 전체에 대해 `extends string` 조건을 평가한다는 점이다.
  > 솔직히 이 부분은 잘 이해가 되지 않습니다.
- Exclude를 취할 복제된 유니언을 추가로 선언하는 방식이 필요함을 다른 사람의 풀이를 보고 확인했다.
- 실제 풀이는 `U2`라는 추가 제너릭을 생성하고 `U = T[number]`를 복제한다.
- 그리고 `U2 extends string`을 통해 `U2` 유니언을 분배하고, 재귀를 취하는 방식을 사용했다.
- `Combination<[], Exclude<U, U2>>`는 원본 배열 T를 더이상 사용하지 않고, 최초에 생성된 `U`, `U2` 유니언에서 하나씩 추출하면서 마저 조합을 만드는 방식으로 진행된다.

```ts
type CombiHelper<U, A = U> = U extends string
  ? U | `${U} ${CombiHelper<Exclude<A, U>>}`
  : never;

type Combi<T extends string[]> = CombiHelper<T[number]>;
```

- 추가로 확인한 다른 사람의 풀이 방식이다. `T, U, U2`와 같이 추가 제너릭을 생성하는 대신 유니언으로 변환한 후 별도의 타입을 통해 조합을 만들어내는 방식을 취한다
- 이 때, 유니언을 복제하여 사용하는 방식은 동일하다.

## [Medium-8987-Subsequence](./medium/8987-subsequence.ts)

```ts
type Subsequence<T extends any[]> = T extends [infer F, ...infer R]
  ? [F, ...Subsequence<R>] | Subsequence<R>
  : [];
```

- T를 나누어 재귀를 취하되, 첫번째 원소를 포함하는 경우와 포함하지 않는 경우를 유니언으로 생성한다
- 빈 배열 시 탈출조건을 취하고
- 생성되는 결과들은 탈출조건으로 생성된 빈 배열들을 포함하여 모든 부분 수열을 포함하게 된다

```js
/* 예시: Subsequence<[1, 2]>의 전개 과정 */
// Subsequence<[1, 2]>
// = [1, ...Subsequence<[2]>] | Subsequence<[2]>
// = [1, ...([2, ...Subsequence<[]>] | Subsequence<[]>)] | [2, ...Subsequence<[]>] | Subsequence<[]>
// = [1, ...([2, ...[]] | [])] | [2, ...[]] | []
// = [1, ...[2] | []] | [2] | []
// = [1, 2] | [1] | [2] | []
// = [] | [1] | [2] | [1, 2]
```

## [Medium-9142-CheckRepeatedChars](./medium/9142-check-repeated-chars.ts)

```ts
type CheckRepeatedChars<
  T extends string,
  U extends string = ""
> = T extends `${infer F}${infer R}`
  ? F extends U
    ? true
    : CheckRepeatedChars<R, U | F>
  : false;
```

- `U`를 빈 문자로 초기화 한 후, 첫 문자와 유니언을 비교하기를 반복하며 나왔던 문자를 보관하도록 한다
- `F extends U` 조건에서 유니언에 포함된 문자와 `extends` 조건을 통해 비교하고 있다면 true, 아니라면 유니언에 추가하는 식으로 재귀를 진행한다.

## [Medium-9286-FirstUniqueCharIndex](./medium/9286-first-unique-char-index.ts)

```ts
type FirstUniqueCharIndex<
  T extends string,
  C extends string[] = []
> = T extends ""
  ? -1
  : T extends `${infer F}${infer R}`
  ? F extends C[number]
    ? FirstUniqueCharIndex<R, [...C, F]>
    : R extends `${string}${F}${string}`
    ? FirstUniqueCharIndex<R, [...C, F]>
    : C["length"]
  : never;
```

- 문자열 인덱스 문제는 우선 현재 인덱스를 찾기 위한 튜플 length를 활용해야지 라는 생각으로 `C extends string[] = []`를 생성했다.
- 우선 모든 문자열 순회가 끝난 경우 혹은 빈 문자열인 경우 -1을 반환하도록 한다.
- 문자열을 `${infer F}${infer R}` 형태로 나누어 첫 문자와 나머지 문자열로 분리한다.
- 첫 문자가 `C[number]` 즉, 이미 나왔던 문자라면 그 문자를 포함하여 다시 재귀를 진행한다.
- 나온 적이 없다면 다음을 진행한다.
- 우선 나머지 문자열에 대해서 `${string}${F}${string}` 형태로 패턴 매칭을 진행하고 여기서 존재한다면 그 문자는 반복 문자이므로 위와 동일하게 재귀를 진행한다.
- 여기서 패턴매칭이 되지 않는다면 비 중복 문자이므로 현재까지의 튜플의 길이를 통해 인덱스를 반환한다.

## [Medium-9616-ParseURLParams](./medium/9616-parse-url-params.ts)

```ts
type ParseUrlParams<T> = T extends `${string}:${infer R}`
  ? R extends `${infer P}/${infer RR}`
    ? P | ParseUrlParams<RR>
    : R
  : never;
```

- 이어서 문자열 패턴 매칭을 활용하는 문제이다
- `${string}:${infer R}` 형태로 나누어, params 구조를 가지는 부분 앞부분을 잘라낸다.
- 여기서 R이 다시 나뉘어지는 형태인 경우 뒷부분을 재귀를 진행하고, 아니라면 R을 반환하는 형태가 된다.

## [Medium-9896-GetMiddleElement](./medium/9896-get-middle-element.ts)

```ts
type GetMiddleElement<T> = T extends [infer F, ...infer R, infer L]
  ? R extends []
    ? [F, L]
    : GetMiddleElement<R>
  : T;
```

- 배열의 중간 원소만을 찾는 방식이다.
- 짝수/홀수 구분을 하면서 진행해야 하나 싶다가 배열 분리 방식이 앞과 뒤가 있다는 점이 생각났다.
- 앞과 뒤를 동시에 보면서 남은 부분을 R로 지정한다
- R이 빈 배열이 되어버리면 `[F, L]`을 반환하고
- 아니라면 F와 L을 제외하고 재귀를 진행한다.
- 길이가 0 혹은 1인 배열은 F, R, L 셋의 매칭을 진행할 수 없으므로 원본 배열을 반환한다.
