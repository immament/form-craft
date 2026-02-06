import { AppUiSchemaField, FormField } from "@/types";
import { useShallow } from "zustand/react/shallow";
import { useFormCraft } from "./FormCraftStore.provider";

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
