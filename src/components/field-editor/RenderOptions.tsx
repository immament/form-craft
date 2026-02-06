import { FormField, FormFieldUpdate } from "@/types";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { Label, Input, Button } from "../ui";

export function RenderOptions({
  field,
  updateField,
  removeOption,
}: {
  field: FormField;
  updateField: (id: string, updates: FormFieldUpdate) => void;
  removeOption: (index: number) => void;
}) {
  const [newOption, setNewOption] = useState("");
  const addOption = () => {
    if (newOption.trim()) {
      const currentOptions = field.enum || [];
      updateField(field.$id, {
        enum: [...currentOptions, newOption.trim()],
      });
      setNewOption("");
    }
  };
  return (
    <div>
      <Label>Opções</Label>
      <div className="space-y-2 mt-2">
        {field.enum?.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={option}
              onChange={(e) => {
                const newOptions = [...(field.enum || [])];
                newOptions[index] = e.target.value;
                updateField(field.$id, { enum: newOptions });
              }}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeOption(index)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Add option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addOption()}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={addOption}
            className="h-8 w-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
