// /^(\+|\-)?(\d*)?(\%)?$/
type PlusMinus = "+" | "-";
type PercentSign = "%";

type PrefixCheck<T extends string> = T extends PlusMinus ? T : never;
type SuffixCheck<T extends string> = T extends `${infer R}${PercentSign}`
  ? [R, "%"]
  : [T, ""];

type PercentageParser<P extends string> =
  P extends `${infer Prefix}${infer Rest}`
    ? Prefix extends PlusMinus
      ? [Prefix, ...SuffixCheck<Rest>]
      : ["", ...SuffixCheck<Rest>]
    : ["", "", ""];

type PString1 = "";
type PString2 = "+85%";
type PString3 = "-85%";
type PString4 = "85%";
type PString5 = "85";

type R1 = PercentageParser<PString1>; // expected ['', '', '']
type R2 = PercentageParser<PString2>; // expected ["+", "85", "%"]
type R3 = PercentageParser<PString3>; // expected ["-", "85", "%"]
type R4 = PercentageParser<PString4>; // expected ["", "85", "%"]
type R5 = PercentageParser<PString5>; // expected ["", "85", ""]

type Case0 = ["", "", ""];
type Case1 = ["+", "", ""];
type Case2 = ["+", "1", ""];
type Case3 = ["+", "100", ""];
type Case4 = ["+", "100", "%"];
type Case5 = ["", "100", "%"];
type Case6 = ["-", "100", "%"];
type Case7 = ["-", "100", ""];
type Case8 = ["-", "1", ""];
type Case9 = ["", "", "%"];
type Case10 = ["", "1", ""];
type Case11 = ["", "100", ""];

type TestCase0 = PercentageParser<"">; //  Case0
type TestCase1 = PercentageParser<"+">; //  Case1
type TestCase2 = PercentageParser<"+1">; //  Case2
type TestCase3 = PercentageParser<"+100">; //  Case3
type TestCase4 = PercentageParser<"+100%">; //  Case4
type TestCase5 = PercentageParser<"100%">; //  Case5
type TestCase6 = PercentageParser<"-100%">; //  Case6
type TestCase7 = PercentageParser<"-100">; //  Case7
type TestCase8 = PercentageParser<"-1">; //  Case8
type TestCase9 = PercentageParser<"%">; //  Case9
type TestCase10 = PercentageParser<"1">; // Case10
type TestCase11 = PercentageParser<"100">; // Case11
