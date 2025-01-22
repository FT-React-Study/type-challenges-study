type DeepReadonly<T> = T extends (...args: any[]) => any
  ? T
  : T extends object
  ? {
      readonly [K in keyof T]: DeepReadonly<T[K]>;
    }
  : T;

type X = {
  x: {
    a: 1;
    b: "hi";
  };
  y: "hey";
};

type Expected = {
  readonly x: {
    readonly a: 1;
    readonly b: "hi";
  };
  readonly y: "hey";
};

type DeepTodo = DeepReadonly<X>; // should be same as `Expected`

type X1 = {
  a: () => 22;
  b: string;
  c: {
    d: boolean;
    e: {
      g: {
        h: {
          i: true;
          j: "string";
        };
        k: "hello";
      };
      l: [
        "hi",
        {
          m: ["hey"];
        }
      ];
    };
  };
};

type X2 = { a: string } | { b: number };

// type Expected1 = {
//   readonly a: () => 22;
//   readonly b: string;
//   readonly c: {
//     readonly d: boolean;
//     readonly e: {
//       readonly g: {
//         readonly h: {
//           readonly i: true;
//           readonly j: "string";
//         };
//         readonly k: "hello";
//       };
//       readonly l: readonly [
//         "hi",
//         {
//           readonly m: readonly ["hey"];
//         }
//       ];
//     };
//   };
// };

// type Expected2 = { readonly a: string } | { readonly b: number };

type Expected1 = DeepReadonly<X1>;
type Expected2 = DeepReadonly<X2>;
