type DeepMutable<T extends { [key: keyof any]: any }> = {
  -readonly [key in keyof T]: T[key] extends (...args: any[]) => any
    ? T[key]
    : T[key] extends readonly unknown[]
    ? DeepMutable<T[key]>
    : T[key] extends { [key: keyof any]: any }
    ? DeepMutable<T[key]>
    : T[key];
};