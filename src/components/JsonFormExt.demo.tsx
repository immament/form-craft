import type { FormProps } from "@rjsf/core";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { JSONSchema7 } from "json-schema";
import { JsonFormExt } from "./JsonFormExt";

const originalSchema: JSONSchema7 = {
  "$id": "1",
  title: "",
  type: "object",
  description: "Preencha os seus dados",
  properties: {
    // "email": {
    //   "title": "Email",
    //   "type": "string",
    //   "$id": "email",
    // },
    // "nif": {
    //   "title": "NIF ",
    //   "description":
    //     "Número de Identificação Fiscal (NIF) do utilizador, composto por 9 dígitos numéricos.",
    //   "type": "string",
    //   "pattern": "^[0-9]{9}$",
    //   "$id": "nif",
    // },
    // "name": {
    //   "title": "Nome de utilizador ",
    //   "type": "string",
    //   "minLength": 0,
    //   "maxLength": 100,
    //   "$id": "name",
    // },
    // "address": {
    //   "title": "Morada ",
    //   "type": "string",
    //   "minLength": 0,
    //   "maxLength": 250,
    //   "$id": "address",
    // },
    "postalCode": {
      "title": "Código Postal ",
      "description": "O código postal deve estar no formato 1234 ou 1234-567",
      "type": "string",
      "pattern": "^[0-9]{4}(-[0-9]{3})?$",
      "$id": "postalCode",
    },
    "checkbox_root": {
      "$id": "checkbox_root",
      "title": "Check box ROOT",
      "type": "boolean",
    },
    "city": {
      "title": "Cidade",
      "type": "string",
      "minLength": 0,
      "maxLength": 50,
      "$id": "city",
    },
    "text_root": {
      "$id": "text_root",
      "title": "Text Input ROOT",
      "type": "string",
    },

    "extFields": {
      // "$id": "extFields",
      "type": "object",
      "title": "DEV: dynamic fields (tmp)",
      "properties": {
        // "text": { $ref: "#/properties/extFields/definitions/text" },
        "checkbox2": {
          // "$id": "checkbox2",
          "title": "Check box",
          "type": "boolean",
        },
      },
      definitions: {
        "text": {
          // "$id": "text",
          "title": "Text Input",
          "type": "string",
        },
      },
      "required": ["text"],
    },
  },
  definitions: {},
  // "required": ["nif"],
  "default": {
    "email": "pauloabrantes@decisoesesolucoes.com",
  },
};

const originalUISchema: UiSchema = {
  "ui:order": [
    "email",
    "nif",
    "name",
    "address",
    "postalCode",
    "city",
    "checkbox_root",
    "text_root",
    "extFields",
  ],

  "extFields": {
    "text": {
      "ui:widget": "textarea",
      "conditional": {
        "dependsOn": "checkbox2",
        "condition": "equals",
        "value": "true",
      },
    },
    "checkbox2": {
      "ui:widget": "checkbox",
    },
    "ui:order": ["checkbox2", "text"],
  },
  "checkbox_root": {
    "ui:widget": "checkbox",
  },
  "text_root": {
    "ui:widget": "textarea",
    "conditional": {
      "dependsOn": "checkbox_root",
      "condition": "equals",
      "value": "true",
    },
  },

  "email": {
    "ui:disabled": true,
  },
  "city": {
    // "conditional": {
    //   "dependsOn": "postalCode",
    //   "condition": "equals",
    //   "value": "1",
    // },
  },

  "ui:submitButtonOptions": {
    "submitText": "Gravar",
  },
};

// definitions: {
//   state: { type: "string", title: "State", enum: ["AL", "AK", "AZ"] },
//   nordicCountry: {
//     type: "string",
//     title: "Country",
//     enum: ["de", "fi", "is", "no", "sv"],
//     // enumNames: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
//   },
//   region: {
//     type: "string",
//     title: "Region",
//   },
//   country: {
//     type: "string",
//     title: "Country",
//   },
//   city: {
//     type: "string",
//     title: "City",
//   },
// },
// title: "Location",
// type: "object",
// properties: {
//   location: {
//     type: "string",
//     title: "Where do you live?",
//     enum: ["us", "nordic", "other"],
//   },
// },
// required: ["location", "state"],
// };

// const originalUISchema: UiSchema = {
//   "ui:order": [
//     "location",
//     "state",
//     "nordicCountry",
//     "country",
//     "region",
//     "city",
//   ],
//   location: {
//     "ui:widget": "radio",
//     "ui:options": { inline: true },
//     classNames: "col-xs-12",
//     "ui:enumNames": ["Unites States", "Nordic", "Order"],
//   },
//   state: {
//     conditional: { dependsOn: "location", condition: "equals", value: "us" },
//     // "ui:required": true,
//     classNames: "col-xs-6",
//   },
//   nordicCountry: {
//     "ui:enumNames": ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
//     // Show list of Nordic countries if "Nordic country" was selected
//     // condition: "location=nordic",
//     conditional: {
//       dependsOn: "location",
//       condition: "contains",
//       value: "rdic",
//     },
//     "ui:widget": "radio",
//     classNames: "col-xs-6",
//   },
//   country: {
//     // Show regular text field for other countries
//     // condition: "location=other",
//     conditional: {
//       dependsOn: "location",
//       condition: "equals",
//       value: "other",
//     },
//     classNames: "col-xs-6",
//   },
//   city: {
//     conditional: {
//       dependsOn: "location",
//       condition: "not_empty",
//     },
//     classNames: "col-xs-6",
//   },
//   region: {
//     // Show region field for all non-US countries, expect Iceland
//     // if it was selected from the Nordic country list.
//     // condition: "location=other||nordicCountry=fi,de,no,sv",
//     conditional: {
//       dependsOn: "nordicCountry",
//       condition: "not_empty_equals",
//       value: "fi",
//     },
//     classNames: "col-xs-6",
//   },
// };
const originalFormData = {};

export function JsonFormDemo(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Omit<FormProps<any, RJSFSchema, any>, "schema" | "uiSchema">,
) {
  return (
    <JsonFormExt
      {...props}
      schema={originalSchema}
      uiSchema={originalUISchema}
      formData={originalFormData}
    />
  );
}
