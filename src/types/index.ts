import {
  JSONSchema7,
  JSONSchema7Type,
  JSONSchema7TypeName,
  JSONSchema7Version,
} from "json-schema";

export interface FormSchemaOrg {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldOrg[];
  isMultiStep?: boolean;
  steps?: FormStepOrg[];
}

export interface FormStepOrg {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldOrg[];
}

export interface FormFieldOrg {
  id: string;
  type:
    | "number"
    | "text"
    | "textarea"
    | "password"
    | "email"
    | "date"
    | "time"
    | "radio"
    | "checkbox"
    | "select"
    | "tel"
    | "url"
    | "datetimeLocal"
    | "file";
  // | "text"
  // | "email"
  // | "password"
  // | "number"
  // | "tel"
  // | "url"
  // | "date"
  // | "time"
  // | "datetimeLocal"
  // | "file"
  // | "select"
  // | "checkbox"
  // | "textarea"
  // | "radio";
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

export type FormSchema7 = JSONSchema7;
export type FormSchema = {
  $id: string;
  $schema?: JSONSchema7Version;
  type: "object";
  title: string;
  description?: string;
  properties: Record<string, FormField>;
  definitions: Record<string, FormField>;
  required: string[];
  default?: JSONSchema7Type;
};

export type FormField = {
  $id: string;
  type: JSONSchema7TypeName;
  title: string;
  description?: string;
  enum?: string[]; // enum

  properties?: Record<string, FormField>;
  definitions?: Record<string, FormField>;

  minLength?: number; // => minLength
  maxLength?: number; // => maxLength
  pattern?: string; // => pattern
  message?: string; // ?? missing

  // to remove
  ext_required?: boolean;
  conditional?: any;
  ui_widget?: string;
  ui_placeholder?: string;
};

export type AppUiSchemaField = {
  ["ui:placeholder"]?: string;
  ["ui:widget"]?: string;
  conditional?: {
    dependsOn: string;
    condition:
      | "equals"
      | "not_equals"
      | "contains"
      | "not_empty"
      | "not_empty_equals";
    value: string;
  };
};

export type AppUiSchema = {
  ["ui:order"]: string[];
} & Record<string, AppUiSchemaField | any | undefined>;
// export interface FormSchema {
//   id: string;
//   title: string;
//   description?: string;
//   properties: FormField[];
//   isMultiStep?: boolean;
//   steps?: FormStep[];
// }

export interface FormFieldOld {
  id: string; // => $id
  title: string; // => title
  // missing in FormField
  description?: string; // description
  // FormField: "tel" => missing
  // => formField.type
  dataType?:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null";

  // uiSchema -> "ui:widget"
  ui_widget: // string
  | "text" // default
    | "textarea"
    | "password"
    | "color" // -
    | "email"
    | "uri" // "url"
    | "data-url" // "file"
    | "date"
    | "date-time" // "datetimeLocal"
    | "time"
    // number | integer
    | "updown" // "number"
    | "range" //input[type=range] slider // -
    | "radio"
    // boolean
    | "checkbox" // default
    | "radio"
    | "select"
    // other
    | "hidden" //boolean, string, number and integer
    // no widget!!
    | "tel";

  // "select"
  enum?: string[]; // enum

  validation?: {
    min?: number; // => minLength
    max?: number; // => maxLength
    pattern?: string; // => pattern
    message?: string; // ?? missing
    // maximum?: number;
    // minimum?: number;
  };

  // extra
  ext_required?: boolean; // => required?: string[]

  // ui Schema
  ui_placeholder?: string; // => uiSchema "ui:placeholder"

  // dependencies?: { [name: string]: JsonSchemaFull | string[] };

  conditional?: {
    dependsOn: string;
    condition: "equals" | "not_equals" | "contains" | "not_empty";
    value: string;
  };
}

export type FormFieldWithoutId = Omit<FormField, "$id">;

export interface DragItem {
  id: string;
  type: "sorting" | "field";
  dataType: FormField["type"];
  ui_widget: string; //FormField["ui_widget"];
  title: string;
}

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
}

/*
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
*/
