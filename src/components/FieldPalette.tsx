import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormCraft } from "@/store/FormCraftStore.provider";
import { AppUiSchemaField, DraggedField, FormField } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import {
  CheckSquare,
  ChevronDown,
  Circle,
  FileText,
  Hash,
  Mail,
  PlusIcon,
  Type,
} from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "./ui/button";

const fieldTypes: Array<{
  widget: AppUiSchemaField["ui:widget"];
  label: string;
  icon: React.ReactNode;
  type?: FormField["type"];
}> = [
  { widget: "text", label: "Text Input", icon: <Type className="w-4 h-4" /> },
  { widget: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  {
    widget: "password",
    label: "Password",
    icon: <Type className="w-4 h-4" />,
  },
  {
    widget: "updown",
    label: "Number",
    icon: <Hash className="w-4 h-4" />,
    type: "number",
  },
  // { widget: "tel", label: "Phone", icon: <Hash className="w-4 h-4" /> },
  { widget: "uri", label: "URL", icon: <Type className="w-4 h-4" /> },
  { widget: "date", label: "Date", icon: <Type className="w-4 h-4" /> },
  { widget: "time", label: "Time", icon: <Type className="w-4 h-4" /> },
  {
    widget: "date-time",
    label: "Date & Time",
    icon: <Type className="w-4 h-4" />,
  },
  {
    widget: "data-url",
    label: "File Upload",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    widget: "select",
    label: "Dropdown",
    icon: <ChevronDown className="w-4 h-4" />,
  },
  {
    widget: "checkbox",
    label: "Checkbox",
    icon: <CheckSquare className="w-4 h-4" />,
    type: "boolean",
  },
  {
    widget: "textarea",
    label: "Text Area",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    widget: "radio",
    label: "Radio Button",
    icon: <Circle className="w-4 h-4" />,
  },
];

export function FieldPalette() {
  console.log("FieldPalette ++");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map(({ widget, label, icon, type }) => (
          <PalleteField
            key={`${widget}_${type}`}
            widget={widget}
            title={label}
            icon={icon}
            type={type}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function PalleteField({
  widget,
  title,
  icon,
  type,
}: {
  widget: AppUiSchemaField["ui:widget"];
  title: string;
  icon: React.ReactNode;
  type: FormField["type"] | undefined;
}) {
  // console.log("PalleteField++", widget);
  const dragProps = useMemo(() => {
    return {
      id: `palette-${widget}`,
      data: {
        icon,
        dragType: "field",
        field: { $id: `palette-${widget}`, title, type: type ?? "string" },
        uiField: widget,
      } as DraggedField,
    };
  }, [widget, title, icon, type]);

  const { attributes, listeners, setNodeRef, isDragging } =
    useDraggable(dragProps);
  const { addField } = FormCraft.useActions();

  const handleAdd = useCallback(
    (e: { preventDefault: () => void }) => {
      e.preventDefault();
      addField(
        {
          type: type ?? "string",
          title: `New ${widget} field x`,
          ...(widget === "select" || widget === "radio"
            ? { enum: ["Option 1", "Option 2"] }
            : {}),
        },
        { ["ui:widget"]: widget }
      );
    },
    [widget, type, addField]
  );

  return useMemo(
    () => (
      <div className="flex items-center">
        <div
          ref={setNodeRef}
          {...listeners}
          {...attributes}
          className={cn(
            `p-3 border rounded-lg cursor-grab hover:bg-accent transition-colors touch-none w-full`,
            isDragging && "opacity-20"
          )}
        >
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-sm font-medium">{title}</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          title="Add Field"
          onClick={handleAdd}
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
    ),
    [attributes, listeners, setNodeRef, isDragging, title, handleAdd]
  );
}
