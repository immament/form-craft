import { generateId } from "@/lib/my-utils";
import {
  AppUiSchema,
  AppUiSchemaField,
  FormField,
  FormFieldWithoutId,
  FormSchema,
} from "@/types";
import { FormStoreBaseActions } from "./FormCraftStore";
import { FormCraftStoreType } from "./FormCraftStore.provider";

export const NEW_FIELD_SKELETON_ID = "new-sort-item";

export function createFormCraftActions(
  set: FormCraftStoreType["setState"],
  get: FormCraftStoreType["getState"]
): FormStoreBaseActions {
  return {
    addField: (
      field: FormFieldWithoutId,
      uiField: AppUiSchemaField,
      inSkeletonPlace?: boolean
    ) => {
      set(({ schema, uiSchema, fieldsOrder }) => {
        const newField: FormField = {
          ...field,
          $id: get().actions.newFieldName(field, uiField["ui:widget"]),
        };
        console.log("store_addField", newField, inSkeletonPlace);
        schema.properties[newField.$id] = newField;
        uiSchema[newField.$id] = uiField;
        if (inSkeletonPlace) {
          const skeletonIdx = fieldsOrder.indexOf(NEW_FIELD_SKELETON_ID);
          if (skeletonIdx !== -1) {
            uiSchema["ui:order"].splice(skeletonIdx, 0, newField.$id);
            return;
          }
        }
        uiSchema["ui:order"].push(newField.$id);
      });
    },
    newFieldName: (field, widget) => {
      // || field.ui_widget
      const newName = (widget ?? field.title)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

      if (get().schema.properties[newName]) {
        // if name already exists add id on end
        return newName + "_" + generateId();
      }

      return newName;
    },

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
        state.fieldsOrder = state.uiSchema["ui:order"] = state.uiSchema[
          "ui:order"
        ].filter((oId) => oId !== id);
        if (state.selectedFieldId === id) state.selectedFieldId = undefined;
      });
    },

    reorderFields: (activeIdx, toIdx) =>
      set((state) => {
        const uiOrder = state.uiSchema["ui:order"];
        if (activeIdx >= 0 && toIdx >= 0) {
          arrayMove(uiOrder, activeIdx, toIdx);
          state.fieldsOrder = uiOrder;
        }
      }),

    newItemSkelletonAtEnd: () => {
      set((state) => {
        state.fieldsOrder = [
          ...state.uiSchema["ui:order"],
          NEW_FIELD_SKELETON_ID,
        ];
      });
    },
    newItemSkelletonAtIdx: (index) => {
      set((state) => {
        const result = [...state.uiSchema["ui:order"]];
        result.splice(index, 0, NEW_FIELD_SKELETON_ID);
        state.fieldsOrder = result;
      });
    },
    clearNewItemSkelleton: () => {
      set((state) => {
        state.fieldsOrder = state.uiSchema["ui:order"];
      });
    },

    selectField: (id) => set({ selectedFieldId: id }),

    updateRequiredField: (id, isRequired) => {
      set(({ schema }) => {
        if (isRequired) {
          if (!schema.required.includes(id)) schema.required.push(id);
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
      set({
        schema: { ...template, $id: generateId() },
        selectedFieldId: undefined,
      }),

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
        selectedFieldId: undefined,
        fieldsOrder: uiSchema["ui:order"],
      });
    },
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

function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number) {
  var element = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex, 0, element);
}
