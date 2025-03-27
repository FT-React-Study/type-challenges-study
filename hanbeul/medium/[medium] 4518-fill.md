## [medium] 4518. Fill

#### 문제

`Fill`은 JavaScript의 일반적인 함수입니다. 이제 타입으로 이를 구현해보겠습니다.
`Fill<T, N, Start?, End?>`에서 볼 수 있듯이, `Fill`은 네 가지 타입의 매개변수를 받습니다. 이 중 `T`와 `N`은 필수 매개변수이고, `Start`와 `End`는 선택적 매개변수입니다.
이러한 매개변수들의 요구사항은 다음과 같습니다: `T`는 반드시 `tuple`이어야 하고, `N`은 어떤 타입의 값이든 될 수 있으며, `Start`와 `End`는 0보다 크거나 같은 정수여야 합니다.

> 예시

```ts
type exp = Fill<[1, 2, 3], 0>; // 예상 결과: [0, 0, 0]
```

> 문제 설명

- 이 문제는 `Fill` 함수를 타입으로 구현
- `Fill` 함수는 배열 `T`와 값 `N`을 받아서, 배열의 일부를 `N`으로 채우는 함수
- `Start`와 `End`는 선택적 매개변수로, 채우기를 시작할 인덱스와 끝날 인덱스를 지정

#### 시도 1 (정답)

> 접근 방법

- 배열을 재귀적으로 탐색하면서, 특정 인덱스 범위에 있는 요소들을 `N`으로 채우기
- `Start`와 `End`를 지정하지 않으면, 배열의 처음부터 끝까지 채우기
- 채워야되는 index인지 확인하기 위해 `Index` 배열을 만들어서 체크
- `Index` 배열의 길이가 `Start`와 같아지면, `Switch`를 `true`로 변경
- `Index` 배열의 길이가 `End`와 같아지면, `Switch`를 `false`로 변경
- `End` 도달하기 전에 `T`가 끝나면 `Result` 반환

> 코드

```ts
type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T["length"],
  Index extends unknown[] = [],
  Switch extends boolean = false,
  Result extends any[] = []
> = T extends [infer First, ...infer Rest]
  ? Switch extends true
    ? // Switch가 true인 경우(Index가 End보다 클 경우)
      Index["length"] extends End
      ? // 끝났으면 남은 배열 추가(Index가 End와 같아지면 끝나는 것이므로)
        [...Result, ...T]
      : // 아직 끝나지 않았으면 다음 요소 추가
        Fill<Rest, N, Start, End, [...Index, unknown], Switch, [...Result, N]>
    : // Switch가 false인 경우(Index가 Start보다 작을 경우)
    Index["length"] extends Start
    ? // Switch가 false인데 Start와 같아졌을 경우
      Start extends End
      ? // Start와 End가 같으면 N으로 변경 X(원래 값 추가)
        [...Result, First, ...Rest]
      : // Start와 End가 같지 않으면 N으로 변경, Switch를 true로 변경
        Fill<Rest, N, Start, End, [...Index, unknown], true, [...Result, N]>
    : // Switch가 false인데 Start보다 작지 않을 경우 그냥 진행
      Fill<Rest, N, Start, End, [...Index, unknown], Switch, [...Result, First]>
  : Result;
```

> 코드 설명

- `T`를 재귀적으로 탐색하면서 `First` 요소 확인
- `Switch`가 `true`인 경우,
  - `Index` 배열의 길이가 `End`와 같아지면 끝나는 것이므로 남은 배열 추가
  - 아직 끝나지 않았으면 다음 요소 추가
- `Switch`가 `false`인 경우,
  - `Index` 배열의 길이가 `Start`와 같아지면 채워야되는 요소가 되므로 `N`으로 변경, `Switch`를 `true`로 변경
  - 아직 채워야되는 요소가 아니면 그냥 진행
- `End` 도달하기 전에 `T`가 끝나면 `Result` 반환
