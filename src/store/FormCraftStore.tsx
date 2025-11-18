import {
  AppUiSchema,
  AppUiSchemaField,
  FormFieldUpdate,
  FormFieldWithoutId,
  FormSchema,
} from "@/types";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface FormCraftStore {
  // sdata
  schema: FormSchema;
  uiSchema: AppUiSchema;
  selectedFieldId: string | undefined;
  // actions
  actions: FormStoreActions;
  fieldsOrder: string[];
}

export type FormStoreActions = FormStoreBaseActions;

export type FormStoreBaseActions = {
  addField: (
    field: FormFieldWithoutId,
    uiField: AppUiSchemaField,
    inSkeletonPlace?: boolean
  ) => void;
  updateField: (id: string, updates: FormFieldUpdate) => void;
  updateFieldUi: (id: string, updates: Partial<AppUiSchemaField>) => void;
  removeField: (id: string) => void;

  reorderFields: (activeIdx: number, toIdx: number) => void;
  newItemSkelletonAtEnd: () => void;
  newItemSkelletonAtIdx: (index: number) => void;
  clearNewItemSkelleton: () => void;

  selectField: (id: string | undefined) => void;
  updateRequiredField: (id: string, isRequired: boolean) => void;
  updateSchema: (updates: Partial<Omit<FormSchema, "fields">>) => void;
  loadTemplate: (template: Omit<FormSchema, "id">) => void;

  loadJsonSchema: (schemas: {
    jsonSchema: JSONSchema7;
    uiSchema: UiSchema;
  }) => void;
  regenerateFieldIds: () => void;
  exportSchema: () => FormSchema;
  exportJsonSchema: () => { jsonSchema: JSONSchema7; uiSchema: UiSchema };
  exportReactComponent: () => string;

  newFieldName: (
    field: FormFieldWithoutId,
    widget: string | undefined
  ) => string;
};

// export type FormStoreMultiStepActions = {
//   toggleMultiStep: () => void;
//   addStep: () => void;
//   removeStep: (stepId: string) => void;
//   updateStep: (stepId: string, updates: Partial<FormStepOrg>) => void;
//   moveFieldToStep: (fieldId: string, stepId: string) => void;
//   setCurrentStep: (step: number) => void;
// };
