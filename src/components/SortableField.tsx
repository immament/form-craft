import { FormCraft } from "@/store/FormCraft";
import { AppUiSchemaField, DraggedField, FormField } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { FormBuilderField } from "./FormBuilderField";

export function SortableFieldWrapper({
  fieldId,
  isClone,
}: {
  fieldId: string;
  isClone?: boolean;
}) {
  const field = FormCraft.useSchemaField(fieldId);
  // log.debug("SortableFieldWrapper", fieldId, field);
  const uiField = FormCraft.useUiSchemaField(fieldId);
  const isRequired = FormCraft.useIsFieldRequired(fieldId);

  if (!field) return <div>Not found field "{fieldId}"</div>;
  if (!uiField) return <div>Not found Ui field "{fieldId}"</div>;

  return (
    <SortableField
      key={fieldId}
      field={field}
      uiField={uiField}
      isRequired={isRequired}
      isClone={isClone}
    />
  );
}

interface SortableFieldProps {
  field: FormField;
  uiField: AppUiSchemaField;
  isRequired?: boolean;
  isClone?: boolean;
}
export function SortableField({
  field,
  uiField,
  isRequired,
  isClone,
}: SortableFieldProps) {
  // if (isClone) {
  // log.debug("SortableField ++", isClone, field, field?.$id);
  // }
  // log.debug("SortableField ++", isClone, ",", field.$id, ",", field.title);

  const props = useMemo(() => {
    // log.debug(
    //   "SortableField props MEMO",
    //   isClone,
    //   ",",
    //   field.$id,
    //   ",",
    //   field.title,
    // );
    return {
      id: isClone ? "CLONE" : field.$id,
      data: {
        // id: field.$id,
        // dragType: "sorting",
        // type: field.type,
        // widget: uiField["ui:widget"],
        // title: field.title,

        dragType: "sorting",
        field: {
          $id: field.$id,
          title: field.title,
          type: field.type ?? "string",
        },
        uiField,
      } as DraggedField,
    };
  }, [field, uiField, isClone, isRequired]);

  const { selectField } = FormCraft.useActions();
  const selectedFieldId = FormCraft.useSelectedFieldId();
  const {
    attributes,
    isDragging,
    listeners,
    // setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
  } = useSortable(props);

  const style = useMemo(
    () => ({ transform: CSS.Transform.toString(transform), transition }),
    [transform, transition],
  );

  return (
    <FormBuilderField
      ref={setNodeRef}
      style={style}
      field={field}
      uiField={uiField}
      isDragging={isDragging}
      isRequired={isRequired}
      isClone={isClone}
      isSelected={selectedFieldId === field.$id}
      draggableAttributes={attributes}
      listeners={listeners}
      onClick={() => {
        selectField(field.$id);
      }}
    />
  );

  // return (
  //   <Card
  //     ref={setNodeRef}
  //     style={style}
  //     className={`${isDragging || isClone ? "opacity-30" : ""} ${
  //       isSelected ? "ring-2 ring-primary" : ""
  //     } transition-all`}
  //     onClick={() => {
  //       selectField(field.$id);
  //     }}
  //   >
  //     <CardContent className="p-4">
  //       <div className="flex items-start justify-between mb-2 h-8">
  //         <div className="flex items-center space-x-2">
  //           <button
  //             ref={setActivatorNodeRef}
  //             {...attributes}
  //             {...listeners}
  //             className="cursor-grab hover:bg-accent p-1 rounded touch-none"
  //           >
  //             <GripVertical className="w-4 h-4 text-muted-foreground" />
  //           </button>
  //           <div>
  //             <Label className="text-sm font-medium">
  //               {field.title}
  //               {isRequired && <span className="text-red-500 ml-1">*</span>}
  //               {uiField.conditional && (
  //                 <span className="text-xs text-blue-500 ml-2">
  //                   (Conditional)
  //                 </span>
  //               )}
  //             </Label>
  //           </div>
  //         </div>
  //         {!isClone && <ActionButtons handleRemoveField={handleRemoveField} />}
  //       </div>
  //       <div className="mt-2">
  //         {uiField["ui:widget"] !== "checkbox" && (
  //           <Label className="text-sm font-medium mb-2 block">
  //             {field.title}
  //           </Label>
  //         )}
  //         <RenderFieldPreview field={field} uiField={uiField} />
  //       </div>
  //     </CardContent>
  //   </Card>
  // );
}
