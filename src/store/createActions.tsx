import { generateId } from "@/lib/my-utils";
import {
  AppUiSchema,
  AppUiSchemaField,
  FormField,
  FormFieldWithoutId,
  FormSchema,
} from "@/types";
import { FormCraftStoreType } from "./FormCraftStoreProvider";
import { FormStoreBaseActions } from "./FormStore";

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
    updateFieldUi: (id, updates) => {
      set(({ uiSchema }) => {
        if (uiSchema[id]) {
          Object.assign(uiSchema[id], updates);
        } else {
          uiSchema[id] = updates;
        }
      });
    },
    removeField: (id) => {
      set((state) => {
        console.log("removeField", id, state, state.schema.properties[id]);
        delete state.schema.properties[id];
        delete state.uiSchema[id];
        state.uiSchema["ui:order"] = state.uiSchema["ui:order"].filter(
          (oId) => oId !== id
        );
        if (state.selectedField === id) state.selectedField = null;
      });
    },

    reorderFields: (activeId, overId) =>
      set(({ uiSchema }) => {
        const order = uiSchema["ui:order"];
        const activeIndex = order.indexOf(activeId);
        const overIndex = order.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          const tmp = order[activeIndex];
          order[activeIndex] = order[overIndex];
          order[overIndex] = tmp;
        }
      }),
    selectField: (id) => set({ selectedField: id }),

    updateRequiredField: (id, isRequired) => {
      set(({ schema }) => {
        if (isRequired) {
          if (!schema.required.includes) schema.required.push(id);
        } else {
          schema.required = schema.required.filter((r) => r !== id);
        }
      });
    },

    updateSchema: (updates) =>
      set((state) => {
        Object.assign(state.schema, updates);
      }),

    loadTemplate: (template) =>
      set({ schema: { ...template, $id: generateId() }, selectedField: null }),

    regenerateFieldIds: () => {
      throw new Error("regenerateFieldIds not implemented!");
    },
    exportSchema: () => get().schema,
    exportJsonSchema: () => ({
      jsonSchema: get().schema,
      uiSchema: get().uiSchema,
    }),
    exportReactComponent: () => "not implemented",
    // store_extractReactComponent(get),

    loadJsonSchema({ jsonSchema, uiSchema }) {
      // const schema = convertFromJsonSchema({
      //   jsonSchema,
      //   uiSchema,
      // }) as FormSchema;
      set({
        schema: jsonSchema as FormSchema,
        // jsonSchema,
        uiSchema: uiSchema as AppUiSchema,
        selectedField: null,
      });
    },
  };
}

function store_addField(
  set: FormCraftStoreType["setState"],
  _get: FormCraftStoreType["getState"]
) {
  return (
    field: FormFieldWithoutId,
    uiField: AppUiSchemaField,
    beforeItemId?: string
  ) => {
    set(({ schema, uiSchema }) => {
      const newField: FormField = { ...field, $id: generateFieldName(field) };

      schema.properties[newField.$id] = newField;
      uiSchema[newField.$id] = uiField;

      console.log("store_addField", field, uiField, beforeItemId);

      // update ui:order
      if (beforeItemId) {
        const index = uiSchema["ui:order"].indexOf(beforeItemId);
        if (index !== -1) {
          const result = [...uiSchema["ui:order"]];
          result.splice(index, 0, newField.$id);
          uiSchema["ui:order"] = result;
        }
      } else {
        uiSchema["ui:order"].push(newField.$id);
      }
    });
  };
}

export function generateFieldName(field: FormFieldWithoutId) {
  // || field.ui_widget
  return (
    field.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_|_$/g, "") +
    "_" +
    generateId()
  );
}
