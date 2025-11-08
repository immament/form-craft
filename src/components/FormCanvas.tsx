import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useFormCraftCurrentStep,
  useFormCraftSchema,
  useFormCraftStoreActions,
} from "@/store/FormCraftStoreProvider";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableField } from "./SortableField";

export function FormCanvas() {
  const { updateSchema } = useFormCraftStoreActions();
  const schema = useFormCraftSchema();
  const currentStep = useFormCraftCurrentStep();
  const { setNodeRef, over } = useDroppable({ id: "form-canvas" });

  // Get current fields based on mode
  const currentFields =
    schema.isMultiStep && schema.steps
      ? schema.steps[currentStep]?.fields || []
      : schema.fields;

  // console.log("currentFields", currentFields);
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <Label htmlFor="form-title">Form Title</Label>
          <Input
            id="form-title"
            value={schema.title}
            onChange={(e) => updateSchema({ title: e.target.value })}
            className="text-xl font-semibold"
          />
          <Label htmlFor="form-description">Description (optional)</Label>
          <Input
            id="form-description"
            value={schema.description || ""}
            onChange={(e) => updateSchema({ description: e.target.value })}
            placeholder="Add a description for your form"
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
              <p>
                Drag fields from the palette to build your{" "}
                {schema.isMultiStep ? `step ${currentStep + 1}` : "form"}
              </p>
            </div>
          ) : (
            <SortableContext
              items={currentFields.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              {currentFields.map((field) => (
                <SortableField key={field.id} field={field} />
              ))}
            </SortableContext>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
