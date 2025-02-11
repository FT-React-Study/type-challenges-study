type Absolute<T extends number | string | bigint> =
  `${T}` extends `-${infer NumberString}` ? NumberString : `${T}`;

type TestNumber = -100;
type ResultNumber = Absolute<TestNumber>; // expected to be "100"

type TestAbsolute1 = Absolute<0>; // '0'
type TestAbsolute2 = Absolute<-0>; // '0'
type TestAbsolute3 = Absolute<10>; // '10'
type TestAbsolute4 = Absolute<-5>; // '5'
type TestAbsolute5 = Absolute<"0">; // '0'
type TestAbsolute6 = Absolute<"-0">; // '0'
type TestAbsolute7 = Absolute<"10">; // '10'
type TestAbsolute8 = Absolute<"-5">; // '5'
type TestAbsolute9 = Absolute<-1_000_000n>; // '1000000'
type TestAbsolute10 = Absolute<9_999n>; // '9999'
