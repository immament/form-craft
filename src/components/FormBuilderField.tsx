import { cn } from "@/lib/utils";
import { FormCraft } from "@/store/FormCraft";
import { AppUiSchemaField, FormField } from "@/types";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { GripVertical, SettingsIcon, Trash2 } from "lucide-react";
import { JSX, memo, MouseEventHandler, useCallback } from "react";
import { FieldPalatteInfo } from "./FieldPalette";
import { Button, Card, CardContent, Input, Label } from "./ui";

interface FormBuilderFieldProps {
  field: FormField;
  uiField: AppUiSchemaField;
  isRequired?: boolean;
  isClone?: boolean;
  isDragging?: boolean;
  isSelected?: boolean;
  draggableAttributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}

export function FormBuilderField({
  field,
  uiField,
  ref,
  isClone,
  isSelected,
  isRequired,
  isDragging,
  draggableAttributes,
  listeners,
  ...props
}: FormBuilderFieldProps & React.ComponentProps<"div">) {
  //   log.debug("FormBuilderField ++", isClone, field?.$id);
  return (
    <Card
      ref={ref}
      {...props}
      className={cn(
        "transition-all min-w-72",
        (isDragging || isClone) && "opacity-50",
        isSelected && "ring-2 ring-primary",
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2 h-8">
          <div className="flex items-center space-x-2 flex-wrap">
            <button
              // ref={setActivatorNodeRef}
              {...draggableAttributes}
              {...listeners}
              className="cursor-grab hover:bg-accent p-1 rounded touch-none"
            >
              <GripVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            <div className="flex">
              <FieldPalatteInfo widget={uiField["ui:widget"]} />
              <Label className="text-sm font-medium">
                {isRequired && <span className="text-red-500 ml-1"> *</span>}
                {uiField.conditional && (
                  <span className="text-xs text-blue-500 ml-2">
                    (Condicional)
                  </span>
                )}
              </Label>
            </div>
          </div>
          {!isClone && <ActionButtons fieldId={field.$id} />}
        </div>
        <div className="mt-2">
          <div className="flex justify-between flex-wrap gap-2 mb-2">
            {uiField["ui:widget"] !== "checkbox" ? (
              <Label className="text-sm font-medium block">{field.title}</Label>
            ) : (
              <span></span>
            )}
            <span className="text-xs text-gray-500 ml-2 wrap-break-word">
              {field.$id}
            </span>
          </div>
          <RenderFieldPreview field={field} uiField={uiField} />
        </div>
      </CardContent>
    </Card>
  );
}

const ActionButtons = memo(function _ActionButtons({
  fieldId,
}: {
  fieldId: string;
}) {
  const { removeField } = FormCraft.useActions();

  const handleRemoveField: MouseEventHandler<HTMLButtonElement> = useCallback(
    (ev) => {
      ev.stopPropagation();
      if (confirm("Tem a certeza?")) removeField(fieldId);
    },
    [fieldId, removeField],
  );
  return (
    <div className="flex space-x-1">
      <Button
        variant="ghost"
        size="icon"
        // onClick={() => selectField(field.id)}
        className="h-8 w-8"
      >
        <SettingsIcon className="w-4 h-4" />
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
  );
});

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
