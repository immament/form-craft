import ShadcnForm from "@rjsf/shadcn";
import { RJSFSchema, UiSchema } from "@rjsf/utils";

import { IChangeEvent } from "@rjsf/core";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";
import React from "react";

//ptLocalizer
const validator = customizeValidator({});

// Advanced conditional fields example
//
// Control the visibility of any field by adding a "condition" property to the
// field's UI Schema. The condition should evaluate to either true or false
// based on the current value(s) of other field(s), e.g. someField=someValue.
// The evaluation is done dynamically upon any change in the form data.
//
// Supported conditions in this example are:
//   foo=bar
//   foo!=bar
//   foo=bar,baz
//   foo!=bar,baz
//   foo=bar&&bar=foo
//   foo=bar||bar=foo
//
//   ...and some permutations of these.
//
// Please note that complex conditions do not work, e.g.
// foo=bar||bar=foo&&baz=bar
//

const originalSchema: JSONSchema7 = {
  title: "Location",
  type: "object",
  properties: {
    location: {
      type: "string",
      title: "Where do you live?",
      enum: ["us", "nordic", "other"],
      // enumNames: ["US", "Nordic country", "Other"],
    },
    state: {
      type: "string",
      title: "State",
      enum: ["AL", "AK", "AZ"],
      // enumNames: ["Alabama", "Alaska", "Arizona"],
    },
    // nordicCountry: {
    //   type: "string",
    //   title: "Country",
    //   enum: ["de", "fi", "is", "no", "sv"],
    //   // enumNames: ["Denmark", "Finland", "Iceland", "Norway", "Sweden"],
    // },
    // region: {
    //   type: "string",
    //   title: "Region",
    // },
    // country: {
    //   type: "string",
    //   title: "Country",
    // },
    // city: {
    //   type: "string",
    //   title: "City",
    // },
  },
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
    "ui:options": {
      inline: true,
    },
    classNames: "col-xs-12",
  },
  state: {
    // Show state options only if "US" was selected
    condition2: "location=us",
    classNames: "col-xs-6",
  },
  // nordicCountry: {
  //   // Show list of Nordic countries if "Nordic country" was selected
  //   condition: "location=nordic",
  //   "ui:widget": "radio",
  //   classNames: "col-xs-6",
  // },
  // country: {
  //   // Show regular text field for other countries
  //   condition: "location=other",
  //   classNames: "col-xs-6",
  // },
  // city: {
  //   // Show city field for all countries but only if a location selection
  //   // has been made, i.e. not initially. (It would be nice to be able to
  //   // location!="" or something).
  //   condition: "location=us,nordic,other",
  //   classNames: "col-xs-6",
  // },
  // region: {
  //   // Show region field for all non-US countries, expect Iceland
  //   // if it was selected from the Nordic country list.
  //   condition: "location=other||nordicCountry=fi,de,no,sv",
  //   classNames: "col-xs-6",
  // },
};
const originalFormData = {};

// lodash ++++++++++++++
function pickBy<T>(object: T, conditionFn: (field: T[keyof T]) => boolean) {
  const obj = {} as Partial<T>;
  for (const key in object) {
    // const k = key as keyof T;
    if (object[key] && conditionFn(object[key])) {
      obj[key] = object[key];
    }
  }
  return obj;
}

const isEmpty = (obj: any) =>
  [Object, Array].includes((obj || {}).constructor) &&
  !Object.entries(obj || {}).length;

// Process the initial state for the form.
// Without this step, all fields would be shown initially.
const initialState = processForm(
  originalSchema,
  originalUISchema,
  originalSchema,
  originalUISchema,
  originalFormData
);

// const Form = JSONSchemaForm.default;
const Form = ShadcnForm;

export class MyComp extends React.Component<
  unknown,
  { schema: JSONSchema7; uiSchema: UiSchema; formData: any }
> {
  constructor(props: {}) {
    super(props);
    this.state = initialState;
  }

  handleChange(data: IChangeEvent<any, RJSFSchema, any>) {
    const schema = { ...this.state.schema };
    const uiSchema = { ...this.state.uiSchema };
    const { formData } = data;

    const newState = processForm(
      originalSchema,
      originalUISchema,
      schema,
      uiSchema,
      formData
    );

    this.setState(newState);
  }

  render() {
    return (
      <Form
        schema={this.state.schema}
        uiSchema={this.state.uiSchema}
        formData={this.state.formData}
        validator={validator}
        onChange={this.handleChange.bind(this)}
      />
    );
  }
}

// ReactDOM.render(<MyComp/>, document.getElementById('main'));

/**
 * Calculate new state for form based on UI Schema field conditions and current form data
 *
 * @param originalSchema - Original full schema containing all possible fields
 * @param originalUISchema - Original full UI Schema containing all possible fields
 * @param schema - Current schema
 * @param uiSchema - Current UI schema
 * @param formData - Current form data
 * @return {object} - Object containing new schema, uiSchema, and formData
 */
function processForm(
  originalSchema: JSONSchema7,
  originalUISchema: UiSchema,
  schema: JSONSchema7,
  uiSchema: UiSchema,
  formData: any
) {
  let newSchema: JSONSchema7;
  let newUISchema: UiSchema;
  let newFormData: any;

  let conditionalFields = pickBy(uiSchema, (field) =>
    field.hasOwnProperty("condition2")
  );

  if (isEmpty(conditionalFields)) {
    return { schema, uiSchema, formData };
  }

  conditionalFields = Object.entries(conditionalFields);
  // console.log("conditionalFields", conditionalFields)

  newSchema = Object.assign({}, schema);
  newUISchema = Object.assign({}, uiSchema);
  newFormData = Object.assign({}, formData);

  if (!newSchema.properties) {
    return { schema, uiSchema, formData };
  }

  console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");

  conditionalFields.forEach(([dependant, dependantSchema]: [string, any]) => {
    //  console.log("dep:", dependant, dependantSchema)
    const { rules, allHaveToMatch } = getConditionRules(
      dependantSchema.condition2
    );

    let matches: (boolean | string | undefined)[] = [];
    rules.forEach((rule) => {
      const r = getConditionRule(rule);
      if (!r) {
        return;
      }
      const { field, values: stringValues, invert } = r;
      let visible = invert;

      const values = stringValues.map((value: string | boolean) => {
        if (value === "true") {
          value = true;
        } else if (value === "false") {
          value = false;
        }
        return value;
      });

      if (field && newFormData.hasOwnProperty(field)) {
        let currentValues = Array.isArray(newFormData[field])
          ? newFormData[field]
          : [newFormData[field]];

        values.forEach((value) => {
          console.log("value:", rule, value, visible, invert);
          if (invert) {
            visible = visible && currentValues.indexOf(value) === -1;
          } else {
            visible = visible || currentValues.indexOf(value) !== -1;
          }
          console.log(
            "after:",
            visible,
            currentValues,
            value,
            currentValues.indexOf(value)
          );
        });
      }

      matches.push(visible);
    });

    // Add or remove conditional field from schema
    let shouldBeVisible = false;
    if (matches.length) {
      shouldBeVisible = allHaveToMatch
        ? // foo=bar && bar=foo
          matches.every(Boolean)
        : // foo=bar || bar=foo
          matches.some(Boolean);
    }

    if (shouldBeVisible) {
      if (newSchema.properties && originalSchema.properties)
        newSchema.properties[dependant] = originalSchema.properties[dependant];
    } else {
      if (newSchema.properties) {
        const { [dependant]: ommitted1, ...props1 } = newSchema.properties;

        newSchema.properties = props1;

        const { [dependant]: ommitted2, ...props2 } = newFormData;
        newFormData = props2;
      }
    }
  });

  // Update UI Schema UI order
  // react-jsonschema-form cannot handle extra properties found in UI order
  newUISchema["ui:order"] = [
    originalUISchema["ui:order"],
    Object.keys(newSchema.properties!),
  ].reduce((a, b) => a?.filter((c) => b?.includes(c)));
  // _.intersection(
  //   originalUISchema["ui:order"],
  //   _.keys(newSchema.properties)
  // );
  // Update Schema required fields
  if (originalSchema.hasOwnProperty("required")) {
    newSchema.required = [
      originalSchema.required,
      Object.keys(newSchema.properties!),
    ].reduce((a, b) => a?.filter((c) => b?.includes(c)));

    // _.intersection(
    //   originalSchema.required,
    //   _.keys(newSchema.properties)
    // );
  }

  return {
    schema: newSchema,
    uiSchema: newUISchema,
    formData: newFormData,
  };
}

function getConditionRules(condition = "") {
  let rules = [];
  let allHaveToMatch = false;
  let visible = false;
  // foo=bar || bar=foo
  if (condition.indexOf("||") !== -1) {
    rules = condition.split("||");
    allHaveToMatch = false;
    visible = false;
  }
  // foo=bar && bar=foo
  else if (condition.indexOf("&&") !== -1) {
    rules = condition.split("&&");
    allHaveToMatch = true;
    visible = true;
  }
  // foo=bar
  else {
    rules = [condition];
    allHaveToMatch = true;
    visible = true;
  }
  console.log("getConditionRules", rules, allHaveToMatch);

  return {
    rules,
    allHaveToMatch,
    visible,
  };
}

function getConditionRule(conditionRule: string) {
  let rule: string[] = [];
  let invert;

  // foo!=bar
  if (conditionRule.indexOf("!=") !== -1) {
    rule = conditionRule.split("!=");
    invert = true;
  }
  // foo=bar
  else if (conditionRule.indexOf("=") !== -1) {
    rule = conditionRule.split("=");
    invert = false;
  }

  if (rule.length !== 2) {
    return undefined;
  }

  let [field, valuesStr] = rule;

  const values = valuesStr.split(",");

  return {
    field,
    values,
    invert,
  };
}
