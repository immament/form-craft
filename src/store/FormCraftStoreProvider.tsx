import { generateId } from "@/lib/my-utils";
import { AppUiSchema, FormSchema } from "@/types";
import { JSONSchema7 } from "json-schema";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, Mutate, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { store_createActions } from "./createActions";
import { createFormStoreMultiStepActions } from "./createFormStoreMultiStepActions";
import { FormStore, FormStoreActions } from "./FormStore";

export type FormCraftStoreType = Mutate<
  StoreApi<FormStore>,
  [["zustand/immer", never]]
>;

const FormCraftStoreContext = createContext<FormCraftStoreType | null>(null);

export const FormCraftStoreProvider = ({
  children,
  initSchema,
}: PropsWithChildren & { initSchema?: FormSchema }) => {
  const [store] = useState(() => {
    return createFormCraftStore(initSchema);
    // return createSelectors(store);
  });

  return (
    <FormCraftStoreContext.Provider value={store}>
      {children}
    </FormCraftStoreContext.Provider>
  );
};

function createFormCraftStore(initSchema: FormSchema | undefined) {
  return createStore<FormStore>()(
    immer((set, get) => ({
      schema: initSchema ?? {
        $id: generateId(),
        title: "Untitled Form",
        description: "",
        properties: {},
        type: "object",
        definitions: {},
        required: [],
      },
      jsonSchema: {},
      uiSchema: { ["ui:order"]: [] },
      selectedField: null,
      currentStep: 0,
      actions: {
        ...store_createActions(set, get),
        ...createFormStoreMultiStepActions(set),
      },
    }))
  );
}

// ++ Store Selectors ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export function useFormCraftStoreInContext<U>(
  selector: (state: FormStore) => U
) {
  const store = useContext(FormCraftStoreContext);
  if (!store) throw new Error("Missing FormStoreProvider");
  return useStore(store, selector);
  // return useStoreWithEqualityFn(store, selector);
}

export const useFormCraftStoreActions: () => FormStoreActions = () =>
  useFormCraftStoreInContext((state) => state.actions);

export const useFormCraftSchema: () => FormSchema = () =>
  useFormCraftStoreInContext((state) => state.schema);

export const useFormCraftJsonSchema: () => JSONSchema7 = () =>
  useFormCraftStoreInContext((state) => state.jsonSchema);

export const useFormCraftUiSchema: () => AppUiSchema = () =>
  useFormCraftStoreInContext((state) => state.uiSchema);

export const useFormCraftCurrentStep: () => number = () =>
  useFormCraftStoreInContext((state) => state.currentStep);

export const useFormCraftSelectedField: () => string | null = () =>
  useFormCraftStoreInContext((state) => state.selectedField);
