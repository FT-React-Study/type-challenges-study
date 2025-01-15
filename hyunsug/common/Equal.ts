export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <
  P
>() => P extends B ? 1 : 2
  ? true
  : false;
