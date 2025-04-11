type Combination<T extends string[], U = T[number], U2 = U> = U2 extends string
  ? U2 | `${U2} ${Combination<[], Exclude<U, U2>>}`
  : never;

type CombiHelper<U, A = U> = U extends string
  ? U | `${U} ${CombiHelper<Exclude<A, U>>}`
  : never;

type Combi<T extends string[]> = CombiHelper<T[number]>;
