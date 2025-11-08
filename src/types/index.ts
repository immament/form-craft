export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

// type RecursivelyReplaceNullWithUndefined<T> = T extends null
//   ? undefined
//   : T extends Date
//   ? T
//   : {
//       [K in keyof T]: T[K] extends (infer U)[]
//         ? RecursivelyReplaceNullWithUndefined<U>[]
//         : RecursivelyReplaceNullWithUndefined<T[K]>;
//     };

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  isMultiStep?: boolean;
  steps?: FormStep[];
}

export interface DragItem {
  id: string;
  type: string;
  fieldType: FormField["type"];
}

export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "date"
    | "time"
    | "datetimeLocal"
    | "file"
    | "select"
    | "checkbox"
    | "textarea"
    | "radio";
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
    // customRules?: Array<{
    //   rule: "minLength" | "maxLength" | "regex" | "custom";
    //   value: string | number;
    //   message: string;
    // }> ;
  };
  conditional?: {
    dependsOn: string;
    condition: "equals" | "not_equals" | "contains" | "not_empty";
    value: string;
  };
}

export const exampleJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://example.com/product.schema.json",
  title: "Product",
  description: "A product from Acme's catalog",
  type: "object",
  properties: {
    productId: {
      description: "The unique identifier for a product",
      type: "integer",
    },
    productName: {
      description: "Name of the product",
      type: "string",
    },
    price: {
      description: "The price of the product",
      type: "number",
      minimum: 0,
    },
    tags: {
      description: "Tags for the product",
      type: "array",
      items: {
        type: "string",
      },
      minItems: 1,
      uniqueItems: true,
    },
    dimensions: {
      type: "object",
      properties: {
        length: {
          type: "number",
        },
        width: {
          type: "number",
        },
        height: {
          type: "number",
        },
      },
      required: ["length", "width", "height"],
    },
  },
  required: ["productId", "productName", "price"],
};

export interface JsonSchema {
  id?: string;
  $schema?: string;
  title?: string;
  description?: string;
  type?: string | string[];
  properties?: { [name: string]: JsonSchema };
  required?: string[] | boolean;
  minimum?: number;
  maximum?: number;
}

export interface JsonSchemaFull {
  $id?: string;
  //
  id?: string;
  //
  $schema?: string;
  $ref?: string;
  //
  title?: string;
  //
  description?: string;
  multipleOf?: number;
  //
  maximum?: number;
  exclusiveMaximum?: number | boolean;
  //
  minimum?: number;
  exclusiveMinimum?: number | boolean;
  maxLength?: number;
  minLength?: number;
  pattern?: string | RegExp;
  additionalItems?: boolean | JsonSchemaFull;
  items?: JsonSchemaFull | JsonSchemaFull[];
  contains?: JsonSchemaFull;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  //
  required?: string[] | boolean;
  propertyNames?: boolean | JsonSchemaFull;
  additionalProperties?: boolean | JsonSchemaFull;
  definitions?: { [name: string]: JsonSchemaFull };
  //
  properties?: { [name: string]: JsonSchemaFull };
  patternProperties?: { [name: string]: JsonSchemaFull };
  dependencies?: { [name: string]: JsonSchemaFull | string[] };
  const?: any;
  enum?: any[];
  type?: string | string[]; //
  format?: string;
  allOf?: JsonSchemaFull[];
  anyOf?: JsonSchemaFull[];
  oneOf?: JsonSchemaFull[];
  not?: JsonSchemaFull;
  if?: JsonSchemaFull;
  then?: JsonSchemaFull;
  else?: JsonSchemaFull;
  default?: any;
  examples?: any[];
}
