import { generateId } from "@/lib/my-utils";
import { AppUiSchemaField, FormField, FormSchema } from "@/types";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, Mutate, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { useShallow } from "zustand/react/shallow";
import { FormCraftStore } from "./FormCraftStore";
import { createFormCraftActions } from "./FormCraftStore.actions";

export type FormCraftStoreType = Mutate<
  StoreApi<FormCraftStore>,
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
  return createStore<FormCraftStore>()(
    immer((set, get) => ({
      schema: initSchema ?? {
        $id: generateId(),
        title: "Formulário sem título",
        description: "",
        properties: {},
        type: "object",
        definitions: {},
        required: [],
      },
      uiSchema: { ["ui:order"]: [] },
      selectedFieldId: undefined,
      fieldsOrder: [],
      actions: createFormCraftActions(set, get),
    })),
  );
}

// ++ Store Selectors ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function useFormCraft<U>(selector: (state: FormCraftStore) => U) {
  const store = useContext(FormCraftStoreContext);
  if (!store) throw new Error("Missing FormStoreProvider");
  return useStore(store, selector);
  // return useStoreWithEqualityFn(store, selector);
}

export const FormCraft = {
  useActions: () => useFormCraft((state) => state.actions),
  useSchema: () => useFormCraft((state) => state.schema),
  useFormCraftStore: useFormCraft,
  useUiSchema: () => useFormCraft(({ uiSchema }) => uiSchema),
  useUiSchemaOrder: () => useFormCraft(({ uiSchema }) => uiSchema["ui:order"]),
  useFieldsOrder: () => useFormCraft(({ fieldsOrder }) => fieldsOrder),
  useSelectedFieldId: () => useFormCraft((state) => state.selectedFieldId),
  useSchemaField: (fieldId: string | undefined) =>
    useFormCraft(({ schema }) =>
      fieldId ? schema.properties[fieldId] : undefined,
    ),
  useUiSchemaField: (
    fieldId: string | undefined,
  ): AppUiSchemaField | undefined =>
    useFormCraft(({ uiSchema }) => (fieldId ? uiSchema[fieldId] : undefined)),
  useIsFieldRequired: (fieldId: string | undefined): boolean =>
    useFormCraft(({ schema }) =>
      fieldId ? schema.required.includes(fieldId) : false,
    ),

  useSelectedField(): {
    selectedFieldId?: string;
    field?: FormField;
    uiField?: AppUiSchemaField;
    isRequired?: boolean;
  } {
    const { selectedFieldId, properties, required, uiSchema } = useFormCraft(
      useShallow(
        ({ selectedFieldId, schema: { properties, required }, uiSchema }) => ({
          selectedFieldId,
          properties,
          uiSchema,
          required,
        }),
      ),
    );

    if (!selectedFieldId) return {};
    return {
      selectedFieldId,
      field: properties[selectedFieldId],
      uiField: uiSchema[selectedFieldId],
      isRequired: required.includes(selectedFieldId),
    };
  },
} as const;

// export const FormCraft = {
//   FormCraft.useActions: FormCraft.useActions,
//   useFormCraftSchema,
//   useFormCraftUiSchema,
//   useFormCraftSelectedFieldId,
//   useFormCraftSelectedField,
// };
