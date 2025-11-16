import { generateId } from "@/lib/my-utils";
import { FormField } from "@/types";
import { FormCraftStoreType } from "./FormCraftStoreProvider";
import { FormStoreMultiStepActions } from "./FormStore";

export function createFormStoreMultiStepActions(
  set: FormCraftStoreType["setState"]
): FormStoreMultiStepActions {
  return {
    setCurrentStep: (step: number) => set({ currentStep: step }),
    toggleMultiStep: () =>
      set((state) => ({
        schema: {
          ...state.schema,
          isMultiStep: !state.schema.isMultiStep,
          steps: !state.schema.isMultiStep
            ? [
                {
                  id: generateId(),
                  title: "Step 1",
                  description: "",
                  fields: [...state.schema.fields],
                },
              ]
            : [],
          fields: state.schema.isMultiStep
            ? state.schema.steps?.reduce(
                (allFields, step) => [...allFields, ...step.fields],
                [] as FormField[]
              ) || []
            : state.schema.fields,
        },
        currentStep: 0,
      })),

    addStep: () =>
      set(({ schema }) => {
        (schema.steps ??= []).push({
          id: generateId(),
          title: `Step ${schema.steps.length + 1}`,
          description: "",
          fields: [],
        });
      }),

    removeStep: (stepId: string) =>
      set(({ schema }) => {
        schema.steps = schema.steps?.filter((step) => step.id !== stepId) ?? [];
      }),

    updateStep: (stepId, updates) =>
      set(({ schema }) => {
        const step = schema.steps?.find((step) => step.id === stepId);
        if (step) {
          Object.assign(step, updates);
        }
      }),

    moveFieldToStep: (fieldId, stepId) =>
      set((state) => {
        const field = state.schema.fields.find((f) => f.id === fieldId);
        if (!field || !state.schema.steps) return state;

        return {
          schema: {
            ...state.schema,
            fields: state.schema.fields.filter((f) => f.id !== fieldId),
            steps: state.schema.steps.map((step) =>
              step.id === stepId
                ? { ...step, fields: [...step.fields, field] }
                : {
                    ...step,
                    fields: step.fields.filter((f) => f.id !== fieldId),
                  }
            ),
          },
        };
      }),
  };
}
