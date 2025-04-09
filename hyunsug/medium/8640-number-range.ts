type NumberRange<
  L extends number,
  H extends number,
  Count extends unknown[] = [],
  Result extends number = never,
  Flag extends boolean = Count["length"] extends L ? true : false
> = Flag extends true
  ? Count["length"] extends H
    ? Result | Count["length"]
    : NumberRange<L, H, [...Count, unknown], Result | Count["length"], Flag>
  : NumberRange<L, H, [...Count, unknown]>;
