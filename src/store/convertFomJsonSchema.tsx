import { FormField, FormSchema } from "@/types";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export function convertFromJsonSchema({
  jsonSchema,
}: {
  jsonSchema: JSONSchema7;
  uiSchema: UiSchema;
}): FormSchema {
  const fields = jsonSchema.properties
    ? Object.entries(jsonSchema.properties).map<FormField>(([key, value]) => {
        const field = value as JSONSchema7;
        const result: FormField = {
          $id: key,
          dataType: field.type as FormField["dataType"],
          ui_widget: "text",
          title: field.title ?? "",
          description: field.description,
          enum: field.enum as FormField["enum"],
          // placeholder: <= ui /
          // required <= required array
          validation: {
            min: field.minLength,
            max: field.maxLength,
            pattern: field.pattern,
            // message <= ??
          },
        };
        return result;
      })
    : [];
  const schema: FormSchema = {
    title: jsonSchema.title ?? "",
    description: jsonSchema.description,
    fields,
    id: jsonSchema.$id ?? "",
    // type: "object",
  };
  return schema;
}

export interface RootJsonSchema {
  id: string;
  type: "object";
  // properties?: { [key: string]: JSONSchema7Definition };
  fields: JsonField[];
  dependencies?: { [key: string]: JsonField | string[] };
  title?: string;
  description?: string;
}

// export interface FormField_template {
//   id: string;
//   //type: | "text"| "email"| "password"| "number"| "tel"| "url"| "date"| "time"| "datetimeLocal"| "file"| "select"| "checkbox"| "textarea"| "radio";
//   label: string;
//   placeholder?: string;
//   required?: boolean;
//   options?: string[];
//   validation?: {
//     min?: number;
//     max?: number;
//     pattern?: string;
//     message?: string; //??
//   };
//   conditional?: {
//     dependsOn: string;
//     condition: "equals" | "not_equals" | "contains" | "not_empty";
//     value: string;
//   };
// }

// textarea: a textarea element is used;
// password: an input[type=password] element is used;
// color: an input[type=color] element is used;
// by default, a regular input[type=text] element is used.
// email: An input[type=email] element is used;
// uri: An input[type=url] element is used;
// data-url: By default, an input[type=file] element is used; in case the string is part of an array, multiple files will be handled automatically (see File widgets).
// date: By default, an input[type=date] element is used;
// date-time: By default, an input[type=datetime-local] element is used.
// time: By default an input[type=time] element is used;

// "ui:autofocus": true,
// "ui:emptyValue": "",
// "ui:autocomplete": "family-name",
// "ui:enableMarkdownInDescription": true,
// "ui:description": "Make text **bold** or *italic*. Take a look at other options [here](https://markdown-to-jsx.quantizor.dev/)."
// "ui:help": "Hint: Make it strong!"

export interface JsonField {
  id: string; // => $id
  label?: string; // => title
  // missing in FormField
  description?: string; // description
  // FormField: "tel" => missing
  // => formField.type
  dataType:
    | "string"
    | "number"
    | "integer"
    | "boolean"
    | "object"
    | "array"
    | "null";

  // uiSchema -> "ui:widget"
  type?: // string
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
    | "hidden"; //boolean, string, number and integer

  // "select"
  options?: JSONSchema7Type[];

  validation?: {
    min?: number; // => minLength
    max?: number; // => maxLength
    pattern?: string; // => pattern
    message?: string; // ??
    // maximum?: number;
    // minimum?: number;
  };

  // extra
  required?: boolean; // => required?: string[]

  // ui Schema
  placeholder?: string; // => uiSchema "ui:placeholder"
}

type JSONSchema7Type =
  | string
  | number
  | boolean
  | JSONSchema7Object
  | JSONSchema7Array
  | null;

interface JSONSchema7Object {
  [key: string]: JSONSchema7Type;
}
export interface JSONSchema7Array extends Array<JSONSchema7Type> {}
