import {
  AppUiSchema,
  FormField,
  FormFieldWithoutId,
  FormSchema,
  FormStep,
} from "@/types";
import { UiSchema } from "@rjsf/utils";
import { JSONSchema7 } from "json-schema";

export interface FormStore {
  schema: FormSchema;
  jsonSchema: JSONSchema7;
  uiSchema: AppUiSchema;
  selectedField: string | null;
  currentStep: number;
  actions: FormStoreActions;
}

export type FormStoreActions = FormStoreBaseActions & FormStoreMultiStepActions;

export type FormStoreBaseActions = {
  addField: (field: FormFieldWithoutId, beforeItemId?: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  reorderFields: (activeId: string, overId: string) => void;
  selectField: (id: string | null) => void;
  updateSchema: (updates: Partial<Omit<FormSchema, "fields">>) => void;
  loadTemplate: (template: Omit<FormSchema, "id">) => void;
  loadSchema: (schema: FormSchema) => void;
  loadJsonSchema: (schemas: {
    jsonSchema: JSONSchema7;
    uiSchema: UiSchema;
  }) => void;
  regenerateFieldIds: () => void;
  exportSchema: () => FormSchema;
  exportJsonSchema: () => { jsonSchema: JSONSchema7; uiSchema: UiSchema };
  exportReactComponent: () => string;
};

export type FormStoreMultiStepActions = {
  toggleMultiStep: () => void;
  addStep: () => void;
  removeStep: (stepId: string) => void;
  updateStep: (stepId: string, updates: Partial<FormStep>) => void;
  moveFieldToStep: (fieldId: string, stepId: string) => void;
  setCurrentStep: (step: number) => void;
};
