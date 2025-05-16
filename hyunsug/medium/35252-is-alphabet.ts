type Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
type StringToTuple<
  S extends string,
  R extends readonly string[] = []
> = S extends `${infer F}${infer Rest}` ? StringToTuple<Rest, [...R, F]> : R;

type IsAlphabet<S extends string> = S extends StringToTuple<Alphabet>[number]
  ? true
  : false;
