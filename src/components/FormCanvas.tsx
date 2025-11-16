import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFormCraftSchema,
  useFormCraftStoreActions,
  useFormCraftUiSchema,
} from "@/store/FormCraftStoreProvider";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { SortableField } from "./SortableField";

export function FormCanvas() {
  const { updateSchema } = useFormCraftStoreActions();
  const schema = useFormCraftSchema();
  const uiSchema = useFormCraftUiSchema();
  const { setNodeRef, over } = useDroppable({ id: "form-canvas" });
  console.log("FormCanvas order:", uiSchema["ui:order"]);

  // Get current fields based on mode
  const currentFields = useMemo(
    () =>
      Object.values(schema.properties).map((f) => {
        return {
          field: f,
          uiField: uiSchema[f.$id] ?? {},
          isRequired: schema.required.includes(f.$id),
        };
      }),
    [schema.properties]
  );
  // schema.isMultiStep && schema.steps
  //   ? schema.steps[currentStep]?.fields || []
  //   : schema.fields;

  // console.log("currentFields:", currentFields);
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <Label htmlFor="form-title">Título do formulário</Label>
          <Input
            id="form-title"
            value={schema.title}
            onChange={(e) => updateSchema({ title: e.target.value })}
            className="text-xl font-semibold"
          />
          <Label htmlFor="form-description">Descrição (opcional)</Label>
          <Input
            id="form-description"
            value={schema.description || ""}
            onChange={(e) => updateSchema({ description: e.target.value })}
            placeholder="Adicione uma descrição ao seu formulário"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={setNodeRef}
          className={`space-y-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg ${
            over ? "border-2 border-dashed border-primary" : ""
          }`}
          style={{
            minHeight:
              currentFields.length === 0
                ? "400px"
                : `${Math.max(400, currentFields.length * 150 + 300)}px`,
          }}
        >
          {currentFields.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <p>Arraste os campos da paleta para criar seu formulário</p>
            </div>
          ) : (
            <SortableContext
              items={uiSchema["ui:order"]}
              // strategy={verticalListSortingStrategy}
            >
              {uiSchema["ui:order"].map((key) => (
                <SortableField
                  key={key}
                  field={schema.properties[key]}
                  uiField={uiSchema[key] ?? {}}
                  isRequired={false /*TODO*/}
                />
              ))}
              {/* {currentFields.map(({ field, uiField, isRequired }) => (
                <SortableField
                  key={field.$id}
                  field={field}
                  uiField={uiField}
                  isRequired={isRequired}
                /> */}
            </SortableContext>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
