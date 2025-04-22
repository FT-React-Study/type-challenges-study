type Transpose<M extends number[][], X = M["length"] extends 0 ? [] : M[0]> = {
  [K in keyof X]: {
    [Y in keyof M]: K extends keyof M[Y] ? M[Y][K] : never;
  };
};
