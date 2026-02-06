import { generateId } from "@/lib/my-utils";
import { FormSchema } from "@/types";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { createStore, Mutate, StoreApi, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
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

export function useFormCraft<U>(selector: (state: FormCraftStore) => U) {
  const store = useContext(FormCraftStoreContext);
  if (!store) throw new Error("Missing FormStoreProvider");
  return useStore(store, selector);
  // return useStoreWithEqualityFn(store, selector);
}
