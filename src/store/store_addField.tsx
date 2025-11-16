import { generateId } from "@/lib/my-utils";
import { FormField, FormFieldWithoutId } from "@/types";
import { FormCraftStoreType } from "./FormCraftStoreProvider";

export function store_addField(
  set: FormCraftStoreType["setState"],
  get: FormCraftStoreType["getState"]
): (field: FormFieldWithoutId, beforeItemId?: string) => void {
  return (field, beforeItemId) => {
    set((state) => {
      const newField: FormField = {
        ...field,
        $id: generateFieldName(field),
      };
      console.log(
        "store_addField state:",
        get().uiSchema,
        get().uiSchema["ui:order"]
      );
      state.schema.properties[newField.$id] = newField;

      if (beforeItemId) {
        const index = state.uiSchema["ui:order"].indexOf(beforeItemId);
        if (index !== -1) {
          const result = [...state.uiSchema["ui:order"]];
          result.splice(index, 0, newField.$id);
          state.uiSchema["ui:order"] = result;
        }
      } else {
        state.uiSchema["ui:order"].push(newField.$id);
      }
      // state.schema.fields =
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
