import {
  AppUiSchema,
  AppUiSchemaField,
  FormFieldUpdate,
  FormFieldWithoutId,
  FormSchema,
} from "@/types";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface FormStore {
  schema: FormSchema;
  uiSchema: AppUiSchema;
  selectedField: string | null;
  actions: FormStoreActions;
}

export type FormStoreActions = FormStoreBaseActions;

export type FormStoreBaseActions = {
  addField: (
    field: FormFieldWithoutId,
    uiField: AppUiSchemaField,
    beforeItemId?: string
  ) => void;
  updateField: (id: string, updates: FormFieldUpdate) => void;
  updateFieldUi: (id: string, updates: Partial<AppUiSchemaField>) => void;
  removeField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  selectField: (id: string | null) => void;
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
};

// export type FormStoreMultiStepActions = {
//   toggleMultiStep: () => void;
//   addStep: () => void;
//   removeStep: (stepId: string) => void;
//   updateStep: (stepId: string, updates: Partial<FormStepOrg>) => void;
//   moveFieldToStep: (fieldId: string, stepId: string) => void;
//   setCurrentStep: (step: number) => void;
// };
