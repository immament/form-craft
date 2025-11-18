import { FormProps, IChangeEvent } from "@rjsf/core";
import ShadcnForm from "@rjsf/shadcn";
import { RJSFSchema, UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";
import { useEffect, useMemo, useState } from "react";

export type JsfConditionRule = {
  dependsOn: string;
} & (
  | {
      condition: "equals" | "not_equals" | "not_empty_equals" | "contains";
      value: string;
    }
  | { condition: "not_empty"; value?: undefined }
);

type ProcessFormState = {
  schema: JSONSchema7;
  uiSchema: UiSchema;
  formData: any;
};

export function JsonFormExt(props: FormProps<any, RJSFSchema, any>) {
  // console.log("JsonFormExt ++");

  const conditionalFields = useMemo(() => {
    const result = props.uiSchema && pickConditionalFields(props.uiSchema);
    // console.log("conditionalFields = useMemo:", result, props.uiSchema);
    return result;
  }, [props.uiSchema]);

  const [state, setState] = useState<ProcessFormState | undefined>();

  useEffect(() => {
    if (!conditionalFields) return undefined;
    // const conditionalFields = pickConditionalFields(props.uiSchema);

    const newState = processForm(
      props.schema,
      props.uiSchema ?? {},
      {
        schema: props.schema,
        uiSchema: props.uiSchema ?? {},
        formData: state?.formData ?? props.formData ?? {},
      },
      props.formData ?? {},
      conditionalFields
    );
    setState(newState);
  }, [props.schema, props.uiSchema]);

  function handleChange(data: IChangeEvent<any, RJSFSchema, any>) {
    if (!state || !conditionalFields) return;
    const newState = processForm(
      props.schema,
      props.uiSchema ?? {},
      state,
      data.formData,
      conditionalFields
    );
    setState(newState);
    // console.log("conditionalFields", conditionalFields);

    // console.log("schemaChanged", newState != state);
    // setState(
    //   (state) =>
    //     state &&
    //     processForm(props.schema, state, data.formData, conditionalFields)
    // );
  }

  if (!state) return <></>;

  // console.log("JsonFormExt render:", state.schema.properties);

  return (
    <ShadcnForm
      {...props}
      schema={state.schema}
      uiSchema={state.uiSchema}
      formData={state.formData}
      onChange={handleChange}
    />
  );
}

/**
 * Calculate new state for form based on UI Schema field conditions and current form data
 *
 * @param originalSchema - Original full schema containing all possible fields
 * @param schema - Current schema
 * @param uiSchema - Current UI schema
 * @param formData - Current form data
 * @return Object containing new schema, uiSchema, and formData
 */
function processForm(
  originalSchema: JSONSchema7,
  originalUiSchema: UiSchema,
  state: ProcessFormState,
  formData: any,
  conditionalFields: (UiSchema & { id: string })[]
): ProcessFormState {
  if (!conditionalFields?.length) return state;

  const newSchema: JSONSchema7 = { ...state.schema };
  if (!newSchema.properties) {
    return state;
  }
  let newUiSchema: UiSchema = state.uiSchema;
  let newFormData = formData;
  let schemaChanged = false;
  console.log("processForm +++");
  // const conditionalFieldsEntries = Object.entries(conditionalFields);
  for (const { conditional, id: dependant } of conditionalFields) {
    // const { conditional, id: dependant } = dependantUiSchema;
    if (!conditional) continue;
    let visible: boolean = isFieldVisible(conditional, newFormData);

    if (newSchema.properties) {
      if (visible) {
        if (!newSchema.properties[dependant]) {
          newSchema.properties[dependant] = {
            $ref: `#/definitions/${dependant}`,
          };
          schemaChanged = true;
        }
      } else {
        if (newSchema.properties[dependant]) {
          newSchema.properties = omit(newSchema.properties, dependant);
          if (newFormData.hasOwnProperty(dependant))
            newFormData = omit(newFormData, dependant);
          schemaChanged = true;
        }
      }
    }
  }

  if (schemaChanged) {
    if (newSchema.hasOwnProperty("required")) {
      newSchema.required = [
        originalSchema.required,
        Object.keys(newSchema.properties),
      ].reduce((a, b) => a?.filter((c) => b?.includes(c)));
    }
    if (originalUiSchema["ui:order"]) {
      newUiSchema = {
        ...originalUiSchema,
        ["ui:order"]: intersectArrays(
          originalUiSchema["ui:order"],
          Object.keys(newSchema.properties)
        ),
      };
    }

    console.log("schemaChanged", newSchema.properties, newFormData);
    return {
      schema: { ...newSchema, properties: { ...newSchema.properties } },
      uiSchema: newUiSchema,
      formData: { ...newFormData },
    };
  }
  return state;
}

function intersectArrays<T>(arr1: T[], arr2: T[]): T[] {
  return [arr1, arr2].reduce((a, b) => a?.filter((c) => b?.includes(c)));
}

function isFieldVisible(
  { dependsOn, value: filterValue, condition }: JsfConditionRule,
  newFormData: any
) {
  switch (condition) {
    case "equals":
      return valueToArray().indexOf(filterValue) !== -1;
    case "not_equals":
      return valueToArray().indexOf(filterValue) === -1;
    case "not_empty_equals":
      return valueToArray().some((value) => value && value != filterValue);
    case "contains":
      return valueToArray().some((v) => (v as string)?.includes(filterValue));
    case "not_empty":
      return valueToArray().length > 1 || !!newFormData[dependsOn];
  }
  return false;

  function valueToArray() {
    return Array.isArray(newFormData[dependsOn])
      ? newFormData[dependsOn]
      : [newFormData[dependsOn]];
  }
}

function pickConditionalFields(
  uiSchema: UiSchema
): (UiSchema & { id: string })[] {
  const result = [];
  for (const key in uiSchema) {
    // const k = key as keyof T;
    if (uiSchema[key]?.hasOwnProperty("conditional")) {
      result.push({ ...uiSchema[key], id: key });
    }
  }
  return result;
}
// helpers ++++++++++++++

function omit<T>(obj: T, key: keyof T): Omit<T, keyof T> {
  const { [key]: ommitted, ...props } = obj;
  return props;
}
// function pickBy<T>(object: T, conditionFn: (field: T[keyof T]) => boolean) {
//   const obj = {} as Partial<T>;
//   for (const key in object) {
//     // const k = key as keyof T;
//     if (object[key] && conditionFn(object[key])) {
//       obj[key] = object[key];
//     }
//   }
//   return obj;
// }

// function isEmpty(obj: any) {
//   return (
//     [Object, Array].includes((obj || {}).constructor) &&
//     !Object.entries(obj || {}).length
//   );
// }
