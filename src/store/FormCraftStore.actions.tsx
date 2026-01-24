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
  get: FormCraftStoreType["getState"],
): FormStoreBaseActions {
  return {
    addField: (
      field: FormFieldWithoutId,
      uiField: AppUiSchemaField,
      inSkeletonPlace?: boolean,
    ) => {
      set((state) => {
        const { schema, uiSchema, fieldsOrder } = state;
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
            state.selectedFieldId = newField.$id;
            return;
          }
        }
        uiSchema["ui:order"].push(newField.$id);
        fieldsOrder.push(newField.$id);
        state.selectedFieldId = newField.$id;

        // get().actions.selectField(newField.$id);
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

    updateFieldId: (oldId, newId) => {
      if (!oldId || !newId || oldId === newId) return;
      set((state) => {
        const field = state.schema.properties[oldId];
        if (!field) return;

        // create new property
        state.schema.properties[newId] = { ...field, $id: newId };
        // delete old property
        delete state.schema.properties[oldId];

        // update required
        state.schema.required = state.schema.required.map((key) =>
          key === oldId ? newId : key,
        );

        // update uiSchema
        state.uiSchema[newId] = { ...state.uiSchema[oldId] };
        delete state.uiSchema[oldId];

        // update ui:order & fieldsOrder
        state.uiSchema["ui:order"] = state.uiSchema["ui:order"].map((key) =>
          key === oldId ? newId : key,
        );
        state.fieldsOrder = [...state.uiSchema["ui:order"]];

        // update conditional
        state.uiSchema["ui:order"].forEach((key) => {
          if (state.uiSchema[key]?.conditional?.dependsOn === oldId) {
            state.uiSchema[key].conditional.dependsOn = newId;
          }
        });

        // select new field
        if (state.selectedFieldId === oldId) {
          state.selectedFieldId = newId;
        }
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
        delete state.schema.properties[id];
        delete state.uiSchema[id];

        // update required
        state.schema.required = state.schema.required.filter(
          (key) => key !== id,
        );

        // update ui:order & fieldsOrder
        state.uiSchema["ui:order"] = state.uiSchema["ui:order"].filter(
          (oId) => oId !== id,
        );
        state.fieldsOrder = [...state.uiSchema["ui:order"]];

        // delete conditional
        state.uiSchema["ui:order"].forEach((key) => {
          if (state.uiSchema[key]?.conditional?.dependsOn === id) {
            delete state.uiSchema[key].conditional;
          }
        });

        // unselect
        if (state.selectedFieldId === id) state.selectedFieldId = undefined;
      });
    },

    reorderFields: (activeIdx, toIdx) =>
      set((state) => {
        console.log("reorderFields, activeIdx:", activeIdx, "to:", toIdx);
        const uiOrder = state.uiSchema["ui:order"];
        if (activeIdx >= 0 && toIdx >= 0) {
          arrayMove(uiOrder, activeIdx, toIdx);
          state.fieldsOrder = [...uiOrder];
        }
      }),

    newItemSkelletonAtEnd: () => {
      set((state) => {
        console.log(
          "newItemSkelletonAtEnd",
          state.fieldsOrder.indexOf(NEW_FIELD_SKELETON_ID),
        );
        if (state.fieldsOrder.indexOf(NEW_FIELD_SKELETON_ID) === -1) {
          state.fieldsOrder = [
            ...state.uiSchema["ui:order"],
            NEW_FIELD_SKELETON_ID,
          ];
        }
      });
    },
    newItemSkelletonAtIdx: (index) => {
      set((state) => {
        console.log(
          "newItemSkelletonAtIdx, activeIdx:",
          index,
          state.fieldsOrder.indexOf(NEW_FIELD_SKELETON_ID),
        );
        if (state.fieldsOrder.indexOf(NEW_FIELD_SKELETON_ID) !== index) {
          const result = [...state.uiSchema["ui:order"]];
          result.splice(index, 0, NEW_FIELD_SKELETON_ID);
          state.fieldsOrder = result;
        }
      });
    },
    clearNewItemSkelleton: () => {
      console.log("clearNewItemSkelleton");
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
    fixSchema: () => {
      set((state) => {
        state.schema.required = state.schema.required.filter(
          (key) => !!state.schema.properties[key],
        );
        state.schema.definitions = {};
      });
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
        fieldsOrder: uiSchema["ui:order"] ? [...uiSchema["ui:order"]] : [],
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
