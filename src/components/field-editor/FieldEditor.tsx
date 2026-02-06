import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormCraft } from "@/store/FormCraft";

import { XIcon } from "lucide-react";
import { FieldPalatteInfo } from "../FieldPalette";
import { ConditionalLogic } from "./ConditionalLogic";
import { RenderOptions } from "./RenderOptions";
import { ValidationRules } from "./ValidationRules";
import { UpdateFieldId } from "./UpdateFieldId";

export function FieldEditor() {
  const { updateField, selectField, updateRequiredField, updateFieldUi } =
    FormCraft.useActions();
  const fieldId = FormCraft.useSelectedFieldId();
  const field = FormCraft.useSchemaField(fieldId);
  const uiField = FormCraft.useUiSchemaField(fieldId);
  const isRequired = FormCraft.useIsFieldRequired(fieldId);

  if (!field || !uiField) {
    return (
      <Card id="FieldEditor">
        <CardHeader>
          <CardTitle className="text-lg">Propriedades do Campo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Selecione um campo para editar as suas propriedades
          </p>
        </CardContent>
      </Card>
    );
  }

  const removeOption = (index: number) => {
    const currentOptions = field.enum || [];
    updateField(field.$id, {
      enum: currentOptions.filter((_, i) => i !== index),
    });
  };

  const needsOptions =
    uiField["ui:widget"] === "select" || uiField["ui:widget"] === "radio";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span className="flex-1">Propriedades do Campo</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => selectField(undefined)}
          >
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Fechar</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FieldPalatteInfo widget={uiField["ui:widget"]} />
        <div>
          <Label htmlFor="field-label">Etiqueta</Label>
          <Input
            id="field-label"
            value={field.title}
            onChange={(e) => updateField(field.$id, { title: e.target.value })}
          />
        </div>

        {uiField["ui:widget"] !== "checkbox" && (
          <div>
            <Label htmlFor="field-placeholder">Espaço reservado</Label>
            <Input
              id="field-placeholder"
              value={uiField["ui:placeholder"] || ""}
              onChange={(e) =>
                updateFieldUi(field.$id, { ["ui:placeholder"]: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={isRequired}
            onCheckedChange={(checked) =>
              updateRequiredField(field.$id, checked)
            }
          />
          <Label htmlFor="field-required">Obrigatório</Label>
        </div>

        {needsOptions && (
          <RenderOptions
            field={field}
            updateField={updateField}
            removeOption={removeOption}
          />
        )}

        {(uiField["ui:widget"] === "text" ||
          uiField["ui:widget"] === "updown" ||
          uiField["ui:widget"] === "password" ||
          uiField["ui:widget"] === "textarea") && (
          <ValidationRules field={field} updateField={updateField} />
        )}

        {uiField["ui:widget"] === "email" && (
          <div>
            <Label htmlFor="email-message" className="text-xs">
              Mensagem de erro de e-mail personalizado
            </Label>
            <Input
              id="email-message"
              placeholder="Please enter a valid email"
              value={field.message || ""}
              onChange={(e) =>
                updateField(field.$id, {
                  message: e.target.value || undefined,
                })
              }
            />
          </div>
        )}

        <ConditionalLogic
          conditional={uiField.conditional}
          updateFieldUi={updateFieldUi}
          field={field}
        />
        <UpdateFieldId key={field.$id} fieldId={field.$id} />
      </CardContent>
    </Card>
  );
}
