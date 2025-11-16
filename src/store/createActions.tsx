import { generateId } from "@/lib/my-utils";
import { AppUiSchema, FormSchema } from "@/types";
import { FormCraftStoreType } from "./FormCraftStoreProvider";
import { FormStoreBaseActions } from "./FormStore";
import { store_addField } from "./store_addField";
import { store_extractReactComponent } from "./store_extractReactComponent";

export function store_createActions(
  set: FormCraftStoreType["setState"],
  get: FormCraftStoreType["getState"]
): FormStoreBaseActions {
  return {
    addField: store_addField(set, get),
    updateField: (id, updates) => {
      set(({ schema }) => {
        const field = schema.properties[id];
        // const field = schema.fields.find((f) => f.id === id);
        if (field) Object.assign(field, updates);
      });
    },
    removeField: (id) => {
      set((state) => {
        // state.schema.fields = state.schema.fields.filter(
        //   (field) => field.id !== id
        // );
        console.log("removeField", id, state, state.schema?.properties?.[id]);
        delete state.schema.properties[id];
        if (state.selectedField === id) state.selectedField = null;
      });
    },

    reorderFields: (activeId, overId) =>
      set((state) => {
        const orders = state.uiSchema["ui:order"];
        const activeIndex = orders.indexOf(activeId); //fields.findIndex((f) => f.id === activeId);
        const overIndex = orders.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const tmp = orders[activeIndex];
          orders[activeIndex] = orders[overIndex];
          orders[overIndex] = tmp;
        }
      }),

    selectField: (id) => set({ selectedField: id }),

    updateSchema: (updates) =>
      set((state) => {
        Object.assign(state.schema, updates);
      }),

    loadTemplate: (template) =>
      set({ schema: { ...template, $id: generateId() }, selectedField: null }),
    loadSchema: (newSchema) =>
      set({ schema: { ...newSchema }, selectedField: null }),
    regenerateFieldIds: () => {
      throw new Error("regenerateFieldIds not implemented!");
      // set(() => {
      //   state.schema.fields.forEach((field) => {
      //     field.id = generateFieldName(field);
      //   });
      // })
    },
    exportSchema: () => get().schema,
    exportJsonSchema: () => ({
      jsonSchema: get().schema,
      uiSchema: get().uiSchema,
    }),
    exportReactComponent: store_extractReactComponent(get),

    loadJsonSchema({ jsonSchema, uiSchema }) {
      // const schema = convertFromJsonSchema({
      //   jsonSchema,
      //   uiSchema,
      // }) as FormSchema;
      set({
        schema: jsonSchema as FormSchema,
        jsonSchema,
        uiSchema: uiSchema as AppUiSchema,
        selectedField: null,
      });
    },
  };
}
