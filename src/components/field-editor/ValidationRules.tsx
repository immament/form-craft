import { FormField, FormFieldUpdate } from "@/types";
import { Label, Input } from "../ui";

export function ValidationRules({
  field,
  updateField,
}: {
  field: FormField;
  updateField: (id: string, updates: FormFieldUpdate) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Regras de Validação</Label>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min-length" className="text-xs">
            Min Length
          </Label>
          <Input
            id="min-length"
            type="number"
            placeholder="Min"
            value={field.minLength || ""}
            onChange={(e) =>
              updateField(field.$id, {
                minLength: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
        <div>
          <Label htmlFor="max-length" className="text-xs">
            Max Length
          </Label>
          <Input
            id="max-length"
            type="number"
            placeholder="Max"
            value={field.maxLength || ""}
            onChange={(e) =>
              updateField(field.$id, {
                maxLength: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pattern" className="text-xs">
          Padrão Regex
        </Label>
        <Input
          id="pattern"
          placeholder="e.g., ^[A-Za-z]+$"
          value={field.pattern || ""}
          onChange={(e) =>
            updateField(field.$id, {
              pattern: e.target.value || undefined,
            })
          }
        />
      </div>

      <div>
        <Label htmlFor="custom-message" className="text-xs">
          Mensagem de erro personalizada
        </Label>
        <Input
          id="custom-message"
          placeholder="Custom validation message"
          value={field.message || ""}
          onChange={(e) =>
            updateField(field.$id, {
              message: e.target.value || undefined,
            })
          }
        />
      </div>
    </div>
  );
}
