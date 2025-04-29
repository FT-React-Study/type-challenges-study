// type BuildTuple<N extends number, T extends unknown[] = []> = T extends {
//   length: N;
// }
//   ? T
//   : BuildTuple<N, [...T, unknown]>;

// type Flatten<T extends unknown[]> = T extends [infer F, ...infer R]
//   ? F extends unknown[]
//     ? [...Flatten<F>, ...Flatten<R>]
//     : [F, ...Flatten<R>]
//   : [];

// type Build2Matrix<
//   N extends number,
//   Matrix extends unknown[][] = []
// > = Matrix extends { length: N }
//   ? Matrix
//   : Build2Matrix<N, [...Matrix, BuildTuple<N>]>;

// type Square<N extends number> = `${N}` extends `-${infer M extends number}`
//   ? Square<M>
//   : Flatten<Build2Matrix<N>>["length"];

type Abs<N extends number> = `${N}` extends `-${infer M extends number}`
  ? M
  : N;

type BuildTuple<N extends number, T extends unknown[] = []> = T extends {
  length: N;
}
  ? T
  : BuildTuple<N, [...T, unknown]>;

export type Flatten<T extends unknown[]> = T extends [infer F, ...infer R]
  ? F extends unknown[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : [];

type Build2Matrix<
  N extends number,
  Matrix extends unknown[][] = []
> = Matrix extends { length: N }
  ? Matrix
  : Build2Matrix<N, [...Matrix, BuildTuple<N>]>;

type NumberExceptLeadingZeros<N extends number> =
  `${N}` extends `${infer M extends number}0` ? NumberExceptLeadingZeros<M> : N;

type CountEndZero<
  N extends string | number | bigint,
  Zeros extends unknown[] = []
> = N extends 0
  ? 0
  : `${N}` extends `${infer M}0`
  ? CountEndZero<M, [...Zeros, unknown]>
  : Zeros["length"];

type AddZeros<
  ToAdd extends number,
  ZeroCount extends number,
  Added extends string = `${ToAdd}`,
  AddCount extends unknown[] = []
> = AddCount["length"] extends ZeroCount
  ? Added extends `${infer M extends number}`
    ? M
    : never
  : AddZeros<0, ZeroCount, `${Added}00`, [...AddCount, unknown]>;

type Square<
  N extends number,
  ZeroCount = CountEndZero<Abs<N>>,
  Absed = Abs<N>
> = N extends 0
  ? 0
  : ZeroCount extends 0
  ? Flatten<Build2Matrix<Absed>>["length"]
  : AddZeros<
      Flatten<Build2Matrix<NumberExceptLeadingZeros<Absed>>>["length"],
      ZeroCount
    >;
