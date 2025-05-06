type CreateTuple<N extends number, R extends unknown[] = []> = R['length'] extends N ? R : CreateTuple<N, [...R, unknown]>

type Prev<N extends number> = CreateTuple<N> extends [...infer Rest, unknown] ? Rest['length'] : never;

type Hanoi<N extends number, From = 'A', To = 'B', Intermediate = 'C'> = N extends 0 ? [] : [
  ...Hanoi<Prev<N>, From, Intermediate, To>,
  [From, To],
  ...Hanoi<Prev<N>, Intermediate, To, From>
]