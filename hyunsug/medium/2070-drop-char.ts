type DropChar<
  S extends string,
  C extends string
> = S extends `${infer L}${C}${infer R}` ? DropChar<`${L}${R}`, C> : S;

type Butterfly = DropChar<" b u t t e r f l y ! ", " ">; // 'butterfly!'

// @ts-expect-error
type DropCharTest0 = DropChar<"butter fly!", "">; //'butterfly!'
type DropCharTest1 = DropChar<"butter fly!", " ">; //'butterfly!'
type DropCharTest2 = DropChar<"butter fly!", "!">; //'butter fly'
type DropCharTest3 = DropChar<"    butter fly!        ", " ">; //'butterfly!'
type DropCharTest4 = DropChar<" b u t t e r f l y ! ", " ">; //'butterfly!'
type DropCharTest5 = DropChar<" b u t t e r f l y ! ", "b">; //'  u t t e r f l y ! '
type DropCharTest6 = DropChar<" b u t t e r f l y ! ", "t">; //' b u   e r f l y ! '
