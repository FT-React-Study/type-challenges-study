type MapTypes<
  T extends { [key: keyof any]: any },
  R extends { mapFrom: any; mapTo: any }
> = {
  [K in keyof T]: T[K] extends R["mapFrom"]
    ? R extends { mapFrom: T[K] }
      ? R["mapTo"]
      : never
    : T[K];
};
