import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFormCraftSelectedField,
  useFormCraftStoreActions,
} from "@/store/FormCraftStoreProvider";
import { AppUiSchemaField, DragItem, FormField } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Settings, Trash2 } from "lucide-react";
import { JSX, MouseEventHandler, useMemo } from "react";

interface SortableFieldProps {
  field: FormField;
  uiField: AppUiSchemaField;
  isRequired: boolean;
  isClone?: boolean;
}

export function SortableField({
  field,
  uiField,
  isRequired,
  isClone,
}: SortableFieldProps) {
  // console.log("SortableField", field.$id, uiField);
  const { selectField, removeField } = useFormCraftStoreActions();
  const selectedField = useFormCraftSelectedField();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.$id,
    data: {
      id: field.$id,
      dragType: "sorting",
      type: field.type,
      widget: uiField["ui:widget"],
      // ui_widget: field.ui_widget,
      title: field.title,
    } as DragItem,
  });

  const style = useMemo(
    () => ({ transform: CSS.Transform.toString(transform), transition }),
    [transform, transition]
  );
  const isSelected = selectedField === field.$id;

  const handleRemoveField: MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    confirm("Tem a certeza?") && removeField(field.$id);
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""} ${
        isSelected ? "ring-2 ring-primary" : ""
      } transition-all`}
      onClick={() => {
        selectField(field.$id);
      }}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:bg-accent p-1 rounded touch-none"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            <div>
              <Label className="text-sm font-medium">
                {field.title}
                {isRequired && <span className="text-red-500 ml-1">*</span>}
                {uiField.conditional && (
                  <span className="text-xs text-blue-500 ml-2">
                    (Conditional)
                  </span>
                )}
              </Label>
            </div>
          </div>
          {!isClone && (
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                // onClick={() => selectField(field.id)}
                className="h-8 w-8"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveField}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
        <div className="mt-2">
          {uiField["ui:widget"] !== "checkbox" && (
            <Label className="text-sm font-medium mb-1 block">
              {field.title}
            </Label>
          )}
          <RenderFieldPreview field={field} uiField={uiField} />
        </div>
      </CardContent>
    </Card>
  );
}

function RenderFieldPreview({
  field,
  uiField,
}: {
  field: FormField;
  uiField: AppUiSchemaField;
}): JSX.Element | null {
  switch (uiField["ui:widget"]) {
    case "text":
    case "email":
    case "password":
    case "updown":
    case "tel":
    case "uri":
    case "date":
    case "time":
    case "date-time":
    case "data-url":
      return (
        <Input
          type={uiField["ui:widget"]}
          placeholder={
            uiField["ui:placeholder"] || `Enter ${field.title.toLowerCase()}`
          }
          disabled
        />
      );
    case "textarea":
      return (
        <textarea
          className="w-full px-3 py-2 border rounded-md resize-none"
          placeholder={
            uiField["ui:placeholder"] || `Enter ${field.title.toLowerCase()}`
          }
          rows={2}
          disabled
        />
      );
    case "select":
      return (
        <select className="w-full px-3 py-2 border rounded-md" disabled>
          <option className="bg-background">Select an option</option>
          {/* {field.options?.map((option, index) => (
            <option key={index} value={option} className="bg-background">
              {option}
            </option>
          ))} */}
        </select>
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <input type="checkbox" disabled className="rounded" />
          <span className="text-sm">{field.title}</span>
        </div>
      );
    case "radio":
      return (
        <div className="space-y-2">
          {field.enum?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="radio" name={field.$id} disabled />
              <span className="text-sm">{option}</span>
            </div>
          ))}
        </div>
      );
    default:
      return null;
  }
}
