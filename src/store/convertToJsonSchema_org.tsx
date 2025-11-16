import { FormField, FormFieldOrg, FormSchemaOrg } from "@/types";
import { UiSchema } from "@rjsf/utils";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";

export function convertToJsonSchema_org(schema: FormSchemaOrg): {
  jsonSchema: JSONSchema7;
  uiSchema: UiSchema;
} {
  const required: string[] = [];
  const fields = mapFields(schema.fields, required);
  const jsonSchema: JSONSchema7 = {
    $id: schema.id,
    type: "object",
    title: schema.title,
    description: schema.description,
    properties: fields.jsonSchema,
    dependencies: {},
    required: required,
  };

  return {
    jsonSchema,
    uiSchema: fields.uiSchema,
  };

  function mapFields(fields: FormFieldOrg[], requiredFields: string[]) {
    return fields.reduce(
      (acc, f) => {
        if (f.required) {
          requiredFields.push(f.id);
        }
        acc.jsonSchema[f.id] = {
          title: `${f.label} `,
          type: mapFieldType(f.type),
          description: undefined,
          default: undefined,
          // format: f.type,
          pattern: f.validation?.pattern ?? undefined,
          minLength: f.validation?.min ?? undefined,
          maxLength: f.validation?.max ?? undefined,
          // default: "",
        };
        if (f.placeholder) {
          acc.uiSchema[f.id] = {
            "ui:placeholder": f.placeholder,
          };
        }
        return acc;
      },
      { jsonSchema: {}, uiSchema: {} } as {
        jsonSchema: Record<string, JSONSchema7Definition>;
        uiSchema: UiSchema;
      }
    );
  }

  function mapFieldType(
    type: FormFieldOrg["type"] | FormField["ui_widget"]
  ): JSONSchema7TypeName | JSONSchema7TypeName[] {
    switch (type) {
      case "text":
      case "textarea":
      case "email":
      case "password":
      case "uri":
      case "tel":
      case "date":
      case "time":
      case "date-time":
      case "data-url":
      case "select":
      case "checkbox":
        return "string";

      case "updown":
      case "radio":
        return "number";
      default:
        return "string";
    }
  }
}
