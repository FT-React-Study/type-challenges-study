type Pop<T extends readonly any[]> = T extends [...infer F, infer _] ? F : [];

type NumberToUnknownArray<
  T extends number,
  ArrResult extends unknown[] = []
> = ArrResult["length"] extends T
  ? ArrResult
  : NumberToUnknownArray<T, [...ArrResult, unknown]>;

type Plus<A extends number, B extends number> = [
  ...NumberToUnknownArray<A>,
  ...NumberToUnknownArray<B>
]["length"];

// type Fibonacci<T extends number> = T extends 0
//   ? 0
//   : T extends 1
//   ? 1
//   : Plus<
//       Fibonacci<Pop<NumberToUnknownArray<T>>["length"]>,
//       Fibonacci<Pop<Pop<NumberToUnknownArray<T>>["length"]>>
//     >;

// type Fibonacci<T extends number, CurrentIndex extends any[] = [1], Prev extends any[] = [], Current extends any[] = [1]> = CurrentIndex['length'] extends T
//   ? Current['length']
//   : Fibonacci<T, [...CurrentIndex, 1], Current, [...Prev, ...Current]>

type Fibonacci<
  T extends number,
  FibonacciStep extends unknown[] = [1],
  FMinus1 extends unknown[] = [1],
  FMinus2 extends unknown[] = []
> = FibonacciStep["length"] extends T
  ? FMinus1["length"]
  : Fibonacci<T, [...FibonacciStep, 1], [...FMinus1, ...FMinus2], FMinus1>;
