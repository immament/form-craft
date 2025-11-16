import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormCraftStoreActions } from "@/store/FormCraftStoreProvider";
import { DragItem, FormField } from "@/types";
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
import { Button } from "./ui/button";

const fieldTypes: Array<{
  widget: FormField["ui_widget"];
  label: string;
  icon: React.ReactNode;
  dataType?: FormField["type"];
}> = [
  { widget: "text", label: "Text Input", icon: <Type className="w-4 h-4" /> },
  { widget: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  { widget: "password", label: "Password", icon: <Type className="w-4 h-4" /> },
  { widget: "updown", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { widget: "tel", label: "Phone", icon: <Hash className="w-4 h-4" /> },
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

function DraggableField({
  widget,
  title,
  icon,
  dataType,
}: {
  widget: FormField["ui_widget"];
  title: string;
  icon: React.ReactNode;
  dataType?: FormField["type"];
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${widget}`,
    data: {
      id: `palette-${widget}`,
      type: "field",
      ui_widget: widget,
      dataType: dataType ?? "string",
      title: title,
    } as DragItem,
  });

  const { addField } = useFormCraftStoreActions();

  return (
    <div className="flex items-center">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className={`p-3 border rounded-lg cursor-grab hover:bg-accent transition-colors touch-none w-full ${
          isDragging ? "opacity-20" : ""
        }`}
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
        onClick={(e) => {
          e.preventDefault();
          console.log("add field");
          addField({
            type: dataType ?? "string",
            ui_widget: widget,
            title: `New ${widget} field x`,
            ext_required: false,
            ...(widget === "select" || widget === "radio"
              ? { enum: ["Option 1", "Option 2"] }
              : {}),
          });
        }}
      >
        <PlusIcon className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function FieldPalette() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Field Types</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {fieldTypes.map(({ widget, label, icon, dataType }) => (
          <DraggableField
            key={`${widget}_${dataType}`}
            widget={widget}
            title={label}
            icon={icon}
            dataType={dataType}
          />
        ))}
      </CardContent>
    </Card>
  );
}
