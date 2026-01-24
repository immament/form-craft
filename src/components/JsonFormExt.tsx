/* eslint-disable @typescript-eslint/no-explicit-any */
import { logger as log } from "@/utils/logger";
import type { FormProps, IChangeEvent } from "@rjsf/core";
import ShadcnForm from "@rjsf/shadcn";
import type { RJSFSchema, UiSchema } from "@rjsf/utils";
import type { JSONSchema7 } from "json-schema";
import {
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

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

// for (const { id } of conditionalFields) {
//   if (!id) continue;
//   if (props.schema.properties?.[id]) {
//     props.schema.definitions ??= {};
//     props.schema.definitions[id] = props.schema.properties[id];
//     delete props.schema.properties[id];
//   }
// }

export function JsonFormExt(props: FormProps<any, RJSFSchema, any>) {
  const [formState, setFormState] = useState<ProcessFormState>();

  const conditionalFields = useMemo(() => {
    if (props.uiSchema) {
      const result = pickConditionalFields(props.uiSchema, []);
      log.debug("conditionalFields = useMemo:", result);
      return result.length ? result : undefined;
    }
  }, [props.uiSchema]);

  useEffect(() => {
    if (!conditionalFields) {
      setFormState({
        schema: props.schema ?? {},
        uiSchema: props.uiSchema ?? {},
        formData: props.formData ?? props.initialFormData ?? {},
      });
      return;
    }
    log.debug("JsonFormExt2 useEffect  ++");

    const movedProperties = moveToDefinitions(props.schema, conditionalFields);

    const newState = processForm(
      props.schema,
      props.uiSchema ?? {},
      {
        schema: { ...props.schema, ...movedProperties },
        uiSchema: props.uiSchema ?? {},
        formData: props.formData ?? props.initialFormData ?? {},
      },
      props.formData ?? props.initialFormData ?? {},
      conditionalFields,
      true,
    );
    setFormState(newState);
    log.debug("useEffect newState", newState);
  }, [
    props.schema,
    props.uiSchema,
    conditionalFields,
    props.formData,
    props.initialFormData,
  ]);

  // EXT
  const conditionalFieldsExt = useMemo(() => {
    if (props.uiSchema?.extFields) {
      const result = pickConditionalFields(props.uiSchema.extFields, []);
      log.debug("conditionalFieldsExt = useMemo:", result);
      return result.length ? result : undefined;
    }
  }, [props.uiSchema]);

  // EXT
  useEffect(() => {
    if (!conditionalFieldsExt) return undefined;

    log.debug("JsonFormExt2 useEffect EXT ++");

    processFormExt(
      props.schema ?? {},
      props.uiSchema ?? {},
      {
        schema: props.schema,
        uiSchema: props.uiSchema ?? {},
        formData: props.formData ?? {},
      },
      props.formData,
      conditionalFieldsExt,
      setFormState,
      true,
    );
  }, [props.schema, props.uiSchema, props.formData, conditionalFieldsExt]);

  function handleChange(newData: IChangeEvent<any, RJSFSchema, any>) {
    if (!formState) return;
    if (conditionalFields) {
      const newState = processForm(
        props.schema,
        props.uiSchema ?? {},
        formState,
        newData.formData,
        conditionalFields,
        false,
      );
      setFormState(newState);
      log.debug("handleChange newState:", newState);
    } else {
      setFormState({ ...formState, formData: newData.formData });
    }

    if (conditionalFieldsExt) {
      processFormExt(
        props.schema,
        props.uiSchema ?? {},
        formState,
        newData.formData,
        conditionalFieldsExt,
        setFormState,
        false,
      );
    }
  }
  // log.debug("JsonFormExt before rencder:", formState);

  if (!formState) return <></>;

  log.debug(
    "JsonFormExt render:",
    formState.schema,
    formState.uiSchema,
    formState.formData,
  );

  return (
    <ShadcnForm
      {...props}
      schema={formState.schema}
      uiSchema={formState.uiSchema}
      formData={formState.formData}
      onChange={handleChange}
      // omitExtraData={true}
      // liveOmit={true}
    />
  );
}

function moveToDefinitions(
  schema: RJSFSchema,
  conditionalFields: (UiSchema & { id: string })[],
) {
  const definitions = { ...schema.definitions };
  const properties = { ...schema.properties };
  for (const { id } of conditionalFields) {
    if (!id) continue;
    if (!definitions[id] && typeof properties[id] === "object") {
      definitions[id] = omit(properties[id], "$id");
    }
  }
  return { properties, definitions };
}

/**
 * Calculate new state for form based on UI Schema field conditions and current form data
 *
 * @param originalSchema - Original full schema containing all possible fields
 * @param schema - Current schema
 * @param uiSchema - Current UI schema
 * @param formData - Current form data
 * @param conditionalFieldsExt - array with conditional fields
 * @param setFormState - function to update form state
 */
function processFormExt(
  originalSchema: JSONSchema7,
  originalUiSchema: UiSchema,
  formState: ProcessFormState,
  formData: any,
  conditionalFieldsExt: (UiSchema & { id: string })[],
  setFormState: Dispatch<SetStateAction<ProcessFormState | undefined>>,
  init: boolean,
): void {
  let extSchema = formState.schema.properties?.extFields as JSONSchema7;
  log.debug("processFormExt", extSchema);
  if (init) {
    extSchema = {
      ...extSchema,
      ...moveToDefinitions(extSchema, conditionalFieldsExt),
    };
  }

  const newStateExt = processForm(
    originalSchema.properties?.extFields as JSONSchema7,
    originalUiSchema.extFields ?? {},
    {
      schema: extSchema,
      uiSchema: formState.uiSchema.extFields ?? {},
      formData: formState.formData.extFields ?? {},
    },
    formData?.extFields ?? {},
    conditionalFieldsExt,
    false,
    "#/properties/extFields",
  );
  log.debug("handleChange EXT newState:", newStateExt);

  setFormState((s) => {
    if (!s) return;
    const result: ProcessFormState = {
      schema: {
        ...s.schema,
        properties: { ...s.schema.properties, extFields: newStateExt.schema },
      },
      formData: { ...s.formData, extFields: newStateExt.formData },
      uiSchema: { ...s.uiSchema, extFields: newStateExt.uiSchema },
    };
    log.debug("handleChange setFormState EXT full state:", result);
    return result;
  });
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
  conditionalFields: (UiSchema & { id: string })[],
  init: boolean,
  refBase: string = "#",
): ProcessFormState {
  log.debug("processForm +++ state:", state);

  if (!conditionalFields?.length) return state;

  const newSchema: JSONSchema7 = { ...state.schema };
  if (!newSchema.properties) {
    return state;
  }
  let newUiSchema: UiSchema = state.uiSchema;
  let newFormData = formData;
  let schemaChanged = init ?? false;
  log.debug("processForm conditionalFields:", conditionalFields);

  for (const { conditional, id: dependant } of conditionalFields) {
    if (!conditional) continue;
    const visible: boolean = isFieldVisible(conditional, newFormData);

    log.debug(
      "processForm conditional:",
      dependant,
      conditional,
      "visible:",
      visible,
      newSchema.properties[dependant],
    );

    if (visible) {
      if (!newSchema.properties[dependant]) {
        newSchema.properties[dependant] = {
          $ref: `${refBase}/definitions/${dependant}`,
        };
        schemaChanged = true;
      }
    } else {
      // not visible
      if (newSchema.properties[dependant]) {
        log.debug(
          "processForm newSchema.properties[dependant]",
          newSchema.properties[dependant],
        );
        newSchema.properties = omit(newSchema.properties, dependant);
        log.debug("newSchema.properties", newSchema.properties);
        if (Object.prototype.hasOwnProperty.call(newFormData, dependant))
          newFormData = omit(newFormData, dependant);
        schemaChanged = true;
      }
    }
    schemaChanged = true;
  }

  if (schemaChanged) {
    if (Object.prototype.hasOwnProperty.call(newSchema, "required")) {
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
          Object.keys(newSchema.properties),
        ),
      };
    }

    log.debug(
      "processForm schemaChanged:",
      newUiSchema["ui:order"],
      newSchema,
      newUiSchema,
      newFormData,
    );
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
  newFormData: any,
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
    // const val = dependsOn
    //   .split(".")
    //   .reduce(
    //     (o, i) => (typeof o === "object" ? o[i] : undefined),
    //     newFormData,
    //   );
    const val = String(newFormData[dependsOn]);
    return Array.isArray(val) ? val : [val];
  }
}

function pickConditionalFields(
  uiSchema: UiSchema,
  result: (UiSchema & { id: string })[],
): (UiSchema & { id: string })[] {
  for (const key in uiSchema) {
    if (typeof uiSchema[key] === "object") {
      if (Object.prototype.hasOwnProperty.call(uiSchema[key], "conditional")) {
        result.push({ ...uiSchema[key], id: key });
      }
      // pickConditionalFields(uiSchema[key], result);
    }
  }
  return result;
}
// helpers ++++++++++++++

function omit<T>(obj: T, key: keyof T): Omit<T, keyof T> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
