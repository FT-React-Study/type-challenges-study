/*
  8640 - Number Range
  -------
  by AaronGuo (@HongxuanG) #medium

  ### Question

  Sometimes we want to limit the range of numbers...
  For examples.
  ```ts
  type result = NumberRange<2 , 9> //  | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  ```

  > View on GitHub: https://tsch.js.org/8640
*/

/* _____________ Your Code Here _____________ */

// L만큼의 길이를 가진 arr를 만들고
// L만큼의 길이를 가진 arr를 계속 늘려가며 그 길이를 모아주자.
// type ConstructTuple<
//   L extends number,
//   Result extends unknown[] = []
// > = Result["length"] extends L
//   ? Result
//   : ConstructTuple<L, [...Result, unknown]>;

// type NumberRange<L extends number, H extends number, Arr extends unknown[] = ConstructTuple<L>> =
//   Arr['length'] extends H
//     ? Arr['length']
//     : Arr['length'] | NumberRange<L, H, [...Arr, unknown]>

// 140은 재귀가 터져버림
// type NumberRange<
//   L extends number,
//   H extends number,
//   Arr extends unknown[] = [],
//   IsCount = false
// > = Arr["length"] extends H
//   ? H
//   : IsCount extends true
//   ? Arr["length"] | NumberRange<L, H, [...Arr, unknown], IsCount>
//   : Arr["length"] extends L
//   ? L | NumberRange<L, H, [...Arr, unknown], true>
//   : NumberRange<L, H, [...Arr, unknown], false>;
// 얘도 걍 터지네;

// 답지 참조
type Utils<L, C extends any[] = [], R = L> = C["length"] extends L
  ? R
  : Utils<L, [...C, 0], C["length"] | R>;

type NumberRange<L, H> = L | Exclude<Utils<H>, Utils<L>>;

type example = NumberRange<2, 9>;

/* _____________ Test Cases _____________ */
import type { Equal, Expect } from "@type-challenges/utils";

type Result1 = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type Result2 = 0 | 1 | 2;
type Result3 =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33
  | 34
  | 35
  | 36
  | 37
  | 38
  | 39
  | 40
  | 41
  | 42
  | 43
  | 44
  | 45
  | 46
  | 47
  | 48
  | 49
  | 50
  | 51
  | 52
  | 53
  | 54
  | 55
  | 56
  | 57
  | 58
  | 59
  | 60
  | 61
  | 62
  | 63
  | 64
  | 65
  | 66
  | 67
  | 68
  | 69
  | 70
  | 71
  | 72
  | 73
  | 74
  | 75
  | 76
  | 77
  | 78
  | 79
  | 80
  | 81
  | 82
  | 83
  | 84
  | 85
  | 86
  | 87
  | 88
  | 89
  | 90
  | 91
  | 92
  | 93
  | 94
  | 95
  | 96
  | 97
  | 98
  | 99
  | 100
  | 101
  | 102
  | 103
  | 104
  | 105
  | 106
  | 107
  | 108
  | 109
  | 110
  | 111
  | 112
  | 113
  | 114
  | 115
  | 116
  | 117
  | 118
  | 119
  | 120
  | 121
  | 122
  | 123
  | 124
  | 125
  | 126
  | 127
  | 128
  | 129
  | 130
  | 131
  | 132
  | 133
  | 134
  | 135
  | 136
  | 137
  | 138
  | 139
  | 140;
type cases = [
  Expect<Equal<NumberRange<2, 9>, Result1>>,
  Expect<Equal<NumberRange<0, 2>, Result2>>,
  Expect<Equal<NumberRange<0, 140>, Result3>>
];

/* _____________ Further Steps _____________ */
/*
  > Share your solutions: https://tsch.js.org/8640/answer
  > View solutions: https://tsch.js.org/8640/solutions
  > More Challenges: https://tsch.js.org
*/
