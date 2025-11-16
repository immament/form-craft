import { FormField, FormSchema } from "@/types";
import { UiSchema } from "@rjsf/utils";
import {
  JSONSchema7,
  JSONSchema7Definition,
  JSONSchema7TypeName,
} from "json-schema";

export function convertToJsonSchema(schema: FormSchema) {
  const required: string[] = [];
  const fields = mapFields(schema.fields, required);
  const jsonSchema: JSONSchema7 = {
    $id: schema.id,
    type: "object",
    title: schema.title,
    description: schema.description,
    properties: fields.jsonSchema.properties,
    definitions: fields.jsonSchema.definitions,

    required: [...required],
  };

  return {
    jsonSchema,
    uiSchema: fields.uiSchema,
  };

  function mapFields(fields: FormField[], requiredFields: string[]) {
    return fields.reduce(
      (acc, f) => {
        if (f.ext_required) {
          requiredFields.push(f.$id);
        }
        const prop: JSONSchema7Definition = {
          title: `${f.title} `,
          type: mapFieldType(f.ui_widget),
          description: "",
          // format: f.type,
          pattern: f.validation?.pattern ?? undefined,
          minLength: f.validation?.min ?? undefined,
          maxLength: f.validation?.max ?? undefined,
        };
        const ui = {} as UiSchema;
        if (f.ui_placeholder) {
          ui["ui:placeholder"] = f.ui_placeholder;
        }

        // console.log("mapField:", f);

        if (f.conditional) {
          acc.jsonSchema.definitions[f.$id] = prop;
          ui.conditional = f.conditional;
          console.log("conditional", ui);
        } else {
          acc.jsonSchema.properties[f.$id] = prop;
        }

        acc.uiSchema[f.$id] = ui;
        acc.uiSchema["ui:order"]?.push(f.$id);

        return acc;
      },
      {
        jsonSchema: { properties: {}, definitions: {} },
        uiSchema: { "ui:order": [] },
        // allOf: [],
        // dependecies: {},
      } as {
        jsonSchema: {
          properties: Record<string, JSONSchema7Definition>;
          definitions: Record<string, JSONSchema7Definition>;
        };
        uiSchema: UiSchema;
        // allOf: JSONSchema7Definition[];
        // dependecies: any;
      }
    );
  }

  /*UI Schema
    {
      newInput1werewr: {
        'ui:placeholder': 'rwerwer',
        'ui:column': '2'
      },
      'ui:order': [
        'newInput1werewr'
      ]
    }
  */
  function mapFieldType(
    type: FormField["ui_widget"]
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
