import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/types";
import {
  Type,
  Mail,
  Hash,
  ChevronDown,
  CheckSquare,
  FileText,
  Circle,
  PlusIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { useFormStore } from "@/store/formStore";

const fieldTypes: Array<{
  type: FormField["type"];
  label: string;
  icon: React.ReactNode;
}> = [
  { type: "text", label: "Text Input", icon: <Type className="w-4 h-4" /> },
  { type: "email", label: "Email", icon: <Mail className="w-4 h-4" /> },
  { type: "password", label: "Password", icon: <Type className="w-4 h-4" /> },
  { type: "number", label: "Number", icon: <Hash className="w-4 h-4" /> },
  { type: "tel", label: "Phone", icon: <Hash className="w-4 h-4" /> },
  { type: "url", label: "URL", icon: <Type className="w-4 h-4" /> },
  { type: "date", label: "Date", icon: <Type className="w-4 h-4" /> },
  { type: "time", label: "Time", icon: <Type className="w-4 h-4" /> },
  {
    type: "datetimeLocal",
    label: "Date & Time",
    icon: <Type className="w-4 h-4" />,
  },
  {
    type: "file",
    label: "File Upload",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    type: "select",
    label: "Dropdown",
    icon: <ChevronDown className="w-4 h-4" />,
  },
  {
    type: "checkbox",
    label: "Checkbox",
    icon: <CheckSquare className="w-4 h-4" />,
  },
  {
    type: "textarea",
    label: "Text Area",
    icon: <FileText className="w-4 h-4" />,
  },
  {
    type: "radio",
    label: "Radio Button",
    icon: <Circle className="w-4 h-4" />,
  },
];

function DraggableField({
  type,
  label,
  icon,
}: {
  type: FormField["type"];
  label: string;
  icon: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { type: "field", fieldType: type },
  });

  const { addField } = useFormStore();

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
          <span className="text-sm font-medium">{label}</span>
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
            type,
            label: `New ${type} field`,
            required: false,
            ...(type === "select" || type === "radio"
              ? { options: ["Option 1", "Option 2"] }
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
        {fieldTypes.map(({ type, label, icon }) => (
          <DraggableField key={type} type={type} label={label} icon={icon} />
        ))}
      </CardContent>
    </Card>
  );
}
