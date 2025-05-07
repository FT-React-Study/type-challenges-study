## [medium] 30430. Tower of Hanoi

> View on GitHub: https://tsch.js.org/30430

#### 문제

Simulate the solution for the Tower of Hanoi puzzle. Your type should take the number of rings as input an return an array of steps to move the rings from tower A to tower B using tower C as additional. Each entry in the array should be a pair of strings `[From, To]` which denotes ring being moved `From -> To`.

#### 문제 설명

- 하노이의 탑 문제를 타입으로 풀어보는 문제
- 주어진 숫자만큼의 원판을 옮기는 경로를 배열로 반환
- A, B, C 타워가 있고, 원판을 A -> B로 옮기는 경로를 배열로 반환

#### 시도 1 (답지 참조)

> 코드

```ts
type Hanoi<
  N extends number,
  From = "A",
  To = "B",
  Intermediate = "C",
  CurrentIndex extends unknown[] = []
> = CurrentIndex["length"] extends N
  ? []
  : [
      ...Hanoi<N, From, Intermediate, To, [...CurrentIndex, unknown]>,
      [From, To],
      ...Hanoi<N, Intermediate, To, From, [...CurrentIndex, unknown]>
    ];
```

> 코드 설명

- CurrentIndex 배열의 길이가 N과 같아지면, 빈 배열을 반환 (원판 N개의 이동이 모두 끝난 경우)
- n-1개의 원판을 보조 기둥으로 이동
- 가장 아래에 있는 n번째 원판을 바로 목적지로 이동
- 아까 보조 기둥에 있던 n-1개의 원판을 목적지로 이동
- 이 과정을 반복하여 원판 N개의 이동이 모두 끝나면, 빈 배열을 반환
