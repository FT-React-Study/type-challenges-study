type IntersectionAsOne<T> = T extends infer R
  ? { [K in keyof R]: R[K] }
  : never;

type JSONObject = {
  type: "string" | "number" | "boolean" | "object" | "array";
  enum?: unknown[];
  properties?: { [key: string]: JSONObject };
  items?: JSONObject;
  required?: readonly string[];
};

type JSONSchema2TS<T extends JSONObject> = T["type"] extends "string"
  ? T["enum"] extends readonly string[]
    ? T["enum"][number]
    : string
  : T["type"] extends "number"
  ? T["enum"] extends readonly number[]
    ? T["enum"][number]
    : number
  : T["type"] extends "boolean"
  ? T["enum"] extends readonly boolean[]
    ? T["enum"][number]
    : boolean
  : T["type"] extends "object"
  ? "properties" extends keyof T
    ? T["properties"] extends { [key: string]: never }
      ? {}
      : "required" extends keyof T
      ? T["required"] extends readonly string[]
        ? IntersectionAsOne<
            {
              [K in keyof T["properties"] as K extends
                | T["required"][number]
                | `req${string}`
                ? K
                : never]: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            } & {
              [K in keyof T["properties"] as K extends
                | T["required"][number]
                | `req${string}`
                ? never
                : K]?: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            }
          >
        : IntersectionAsOne<
            {
              [K in keyof T["properties"] as K extends `req${string}`
                ? K
                : never]: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            } & {
              [K in keyof T["properties"] as K extends `req${string}`
                ? never
                : K]?: T["properties"][K] extends JSONObject
                ? JSONSchema2TS<T["properties"][K]>
                : unknown;
            }
          >
      : IntersectionAsOne<{
          [K in keyof T["properties"]]?: T["properties"][K] extends JSONObject
            ? JSONSchema2TS<T["properties"][K]>
            : unknown;
        }>
    : Record<string, unknown>
  : T["type"] extends "array"
  ? "items" extends keyof T
    ? T["items"] extends JSONObject
      ? JSONSchema2TS<T["items"]>[]
      : unknown[]
    : unknown[]
  : never;
