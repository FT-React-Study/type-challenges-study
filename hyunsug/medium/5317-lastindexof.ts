type Same<A, B> = (<T>() => T extends A ? 1 : 2) extends <P>() => P extends B
  ? 1
  : 2
  ? true
  : false;
type Pop<T extends readonly unknown[]> = T extends [...infer Rest, infer _]
  ? Rest
  : [];

// Popped는 마지막 원소의 index를 표시하는 배열열
type LastIndexOf<
  T extends readonly unknown[],
  U,
  Popped extends readonly unknown[] = Pop<T>
> = T extends [...infer Rest, infer Last]
  ? Same<Last, U> extends true
    ? Popped["length"]
    : LastIndexOf<Rest, U, Pop<Popped>>
  : -1;
