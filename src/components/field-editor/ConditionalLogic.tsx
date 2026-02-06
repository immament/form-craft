import { FormCraft } from "@/store/FormCraft";
import { AppUiSchemaField, ConditionalRule, FormField } from "@/types";
import { useMemo } from "react";
import { Input, Label } from "../ui";

export function ConditionalLogic({
  field,
  conditional,
  updateFieldUi,
}: {
  field: FormField;
  conditional?: ConditionalRule;
  updateFieldUi: (id: string, updates: Partial<AppUiSchemaField>) => void;
}) {
  const { properties } = FormCraft.useSchema();
  const propertiesArray = useMemo(
    () => Object.values(properties).filter((f) => f.$id !== field.$id),
    [properties, field.$id],
  );

  return (
    <div id="ConditionalLogic" className="space-y-3">
      <Label>Lógica Condicional</Label>
      <div className="space-y-2">
        <div>
          <Label htmlFor="depends-on" className="text-xs mb-2">
            Mostrar quando o campo
          </Label>
          <select
            id="depends-on"
            className="w-full px-3 py-2 border rounded-md text-sm"
            value={conditional?.dependsOn || ""}
            onChange={(e) =>
              updateFieldUi(field.$id, {
                conditional: e.target.value
                  ? {
                      dependsOn: e.target.value,
                      condition: "equals",
                      value: "",
                    }
                  : undefined,
              })
            }
          >
            <option value="" className="bg-background">
              Sem dependência
            </option>
            {propertiesArray.map((f) => (
              <option key={f.$id} value={f.$id} className="bg-background">
                {f.title}
              </option>
            ))}
          </select>
        </div>

        {conditional?.dependsOn && (
          <>
            <ConditionalLogicCondition
              field={field}
              conditional={conditional}
              updateFieldUi={updateFieldUi}
            />
            {conditional.condition !== "not_empty" && (
              <div>
                <Label htmlFor="condition-value" className="text-xs mb-2">
                  Value
                </Label>
                <Input
                  id="condition-value"
                  placeholder="Condition value"
                  value={conditional.value || ""}
                  onChange={(e) =>
                    updateFieldUi(field.$id, {
                      conditional: {
                        dependsOn: conditional.dependsOn,
                        condition: conditional.condition,
                        value: e.target.value,
                      },
                    })
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ConditionalLogicCondition({
  field,
  conditional,
  updateFieldUi,
}: {
  field: FormField;
  conditional: ConditionalRule;
  updateFieldUi: (id: string, updates: Partial<AppUiSchemaField>) => void;
}) {
  return (
    <div>
      <Label htmlFor="condition" className="text-xs mb-2">
        Condição
      </Label>
      <select
        id="condition"
        className="w-full px-3 py-2 border rounded-md text-sm"
        value={conditional.condition}
        onChange={(e) =>
          updateFieldUi(field.$id, {
            conditional: {
              dependsOn: conditional.dependsOn,
              condition: e.target.value as any,
              value: conditional.value || "",
            },
          })
        }
      >
        <option key={"equals"} value="equals" className="bg-background">
          Igual a (Equals)
        </option>
        <option key={"not_equals"} value="not_equals" className="bg-background">
          Não é igual a (Not equals)
        </option>
        <option
          key={"not_empty_equals"}
          value="not_empty_equals"
          className="bg-background"
        >
          Não está vazio, não é igual a (Not empty, not equals)
        </option>
        <option key={"contains"} value="contains" className="bg-background">
          Contém (Contains)
        </option>
        <option key={"not_empty"} value="not_empty" className="bg-background">
          Não está vazio (Is not empty)
        </option>
      </select>
    </div>
  );
}
