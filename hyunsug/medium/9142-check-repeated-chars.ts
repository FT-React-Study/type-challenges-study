type CheckRepeatedChars<
  T extends string,
  U extends string = ""
> = T extends `${infer F}${infer R}`
  ? F extends U
    ? true
    : CheckRepeatedChars<R, U | F>
  : false;
