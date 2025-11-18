import {
  JSONSchema7Type,
  JSONSchema7TypeName,
  JSONSchema7Version,
} from "json-schema";

// export type FormSchema7 = JSONSchema7;
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
  // ext_required?: boolean;
  // conditional?: any;
  // ui_widget?: string;
  // ui_placeholder?: string;
};

export type FormFieldUpdate = Partial<FormField>;

export type AppUiSchemaField = {
  ["ui:placeholder"]?: string;
  ["ui:widget"]?: string;
  conditional?: ConditionalRule;
};

export type ConditionalRule = {
  dependsOn: string;
  condition:
    | "equals"
    | "not_equals"
    | "contains"
    | "not_empty"
    | "not_empty_equals";
  value: string;
};

export type AppUiSchema = {
  ["ui:order"]: string[];
} & Record<string, AppUiSchemaField | any | undefined>;

// export interface FormFieldOld {
//   id: string; // => $id
//   title: string; // => title
//   // missing in FormField
//   description?: string; // description
//   // FormField: "tel" => missing
//   // => formField.type
//   dataType?:
//     | "string"
//     | "number"
//     | "integer"
//     | "boolean"
//     | "object"
//     | "array"
//     | "null";

//   // uiSchema -> "ui:widget"
//   ui_widget: // string
//   | "text" // default
//     | "textarea"
//     | "password"
//     | "color" // -
//     | "email"
//     | "uri" // "url"
//     | "data-url" // "file"
//     | "date"
//     | "date-time" // "datetimeLocal"
//     | "time"
//     // number | integer
//     | "updown" // "number"
//     | "range" //input[type=range] slider // -
//     | "radio"
//     // boolean
//     | "checkbox" // default
//     | "radio"
//     | "select"
//     // other
//     | "hidden" //boolean, string, number and integer
//     // no widget!!
//     | "tel";

//   // "select"
//   enum?: string[]; // enum

//   validation?: {
//     min?: number; // => minLength
//     max?: number; // => maxLength
//     pattern?: string; // => pattern
//     message?: string; // ?? missing
//     // maximum?: number;
//     // minimum?: number;
//   };

//   // extra
//   ext_required?: boolean; // => required?: string[]

//   // ui Schema
//   ui_placeholder?: string; // => uiSchema "ui:placeholder"

//   // dependencies?: { [name: string]: JsonSchemaFull | string[] };

//   conditional?: {
//     dependsOn: string;
//     condition: "equals" | "not_equals" | "contains" | "not_empty";
//     value: string;
//   };
// }

export type FormFieldWithoutId = Omit<FormField, "$id">;

export interface DragItem {
  dragType: "sorting" | "field";
  id: string;
  title: string;
  icon: React.ReactNode;
  type?: FormField["type"]; // default" string"
  widget: AppUiSchemaField["ui:widget"];
  // id: string;
  // type: "sorting" | "field";
  // dataType: FormField["type"];
  // ui_widget: string; //FormField["ui_widget"];
  // title: string;
}

export type DraggedField = {
  dragType: "sorting" | "field";
  icon: React.ReactNode;
  field: FormField;
  uiField: AppUiSchemaField;
};
