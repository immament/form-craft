import { FormProps } from "@rjsf/core";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { JsonFormExt } from "./JsonFormExt";

const originalSchema: JSONSchema7 = {
  definitions: {
    state: { type: "string", title: "State", enum: ["AL", "AK", "AZ"] },
    nordicCountry: {
      type: "string",
      title: "Country",
      enum: ["de", "fi", "is", "no", "sv"],
      // enumNames: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
    },
    region: {
      type: "string",
      title: "Region",
    },
    country: {
      type: "string",
      title: "Country",
    },
    city: {
      type: "string",
      title: "City",
    },
  },
  title: "Location",
  type: "object",
  properties: {
    location: {
      type: "string",
      title: "Where do you live?",
      enum: ["us", "nordic", "other"],
    },
  },
  required: ["location", "state"],
};

const originalUISchema: UiSchema = {
  "ui:order": [
    "location",
    "state",
    "nordicCountry",
    "country",
    "region",
    "city",
  ],
  location: {
    "ui:widget": "radio",
    "ui:options": { inline: true },
    classNames: "col-xs-12",
    "ui:enumNames": ["Unites States", "Nordic", "Order"],
  },
  state: {
    conditional: { dependsOn: "location", condition: "equals", value: "us" },
    // "ui:required": true,
    classNames: "col-xs-6",
  },
  nordicCountry: {
    "ui:enumNames": ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
    // Show list of Nordic countries if "Nordic country" was selected
    // condition: "location=nordic",
    conditional: {
      dependsOn: "location",
      condition: "contains",
      value: "rdic",
    },
    "ui:widget": "radio",
    classNames: "col-xs-6",
  },
  country: {
    // Show regular text field for other countries
    // condition: "location=other",
    conditional: {
      dependsOn: "location",
      condition: "equals",
      value: "other",
    },
    classNames: "col-xs-6",
  },
  city: {
    conditional: {
      dependsOn: "location",
      condition: "not_empty",
    },
    classNames: "col-xs-6",
  },
  region: {
    // Show region field for all non-US countries, expect Iceland
    // if it was selected from the Nordic country list.
    // condition: "location=other||nordicCountry=fi,de,no,sv",
    conditional: {
      dependsOn: "nordicCountry",
      condition: "not_empty_equals",
      value: "fi",
    },
    classNames: "col-xs-6",
  },
};
const originalFormData = {};

export function JsonFormDemo(
  props: Omit<FormProps<any, RJSFSchema, any>, "schema" | "uiSchema">
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
