import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { NEW_FIELD_SKELETON_ID } from "@/store/FormCraftStore.actions";
import { FormCraft } from "@/store/FormCraftStore.provider";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableField, SortableFieldWrapper } from "./SortableField";

// export function useDragOrder() {
//   const order = FormCraft.useFieldsOrder();

//   return useMemo(() => {
//     return order;
//   }, [order]);
// }

export function FormCanvas() {
  console.log("FormCanvas ++");
  return (
    <Card id="FormCanvas">
      <CardHeader>
        <FormCanvasHeader />
      </CardHeader>
      <CardContent>
        <FormCanvasContent />
      </CardContent>
    </Card>
  );
}
function FormCanvasHeader() {
  console.log("FormCanvasHeader ++");
  const { updateSchema } = FormCraft.useActions();
  const { title, description } = FormCraft.useSchema();

  return (
    <div id="FormCanvasHeader" className="space-y-2">
      <Label htmlFor="form-title">Título do formulário</Label>
      <Input
        id="form-title"
        value={title}
        onChange={(e) => updateSchema({ title: e.target.value })}
        className="text-xl font-semibold"
      />
      <Label htmlFor="form-description">Descrição (opcional)</Label>
      <Input
        id="form-description"
        value={description || ""}
        onChange={(e) => updateSchema({ description: e.target.value })}
        placeholder="Adicione uma descrição ao seu formulário"
      />
    </div>
  );
}

function FormCanvasContent() {
  const fieldsOrder = FormCraft.useFieldsOrder();
  const { setNodeRef, over, active } = useDroppable({ id: "form-canvas" });

  console.log("FormCanvasContent ++", "fieldsOrder:", fieldsOrder);
  return (
    <div
      id="FormCanvasContent"
      ref={setNodeRef}
      className={cn(
        "space-y-4 p-4 border-2 border-dashed border-muted-foreground/25 rounded-lg pb-28",
        over && "border-2 border-dashed border-primary",
      )}
      style={{ minHeight: "596px" }}
    >
      {fieldsOrder.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          <p>Arraste os campos da paleta para criar seu formulário</p>
        </div>
      ) : (
        <SortableContext
          items={fieldsOrder}
          strategy={verticalListSortingStrategy}
          id="form-canvas-ctx"
        >
          {fieldsOrder.map((key) =>
            key === NEW_FIELD_SKELETON_ID ? (
              active?.data.current && (
                <SortableField
                  key={key}
                  field={active.data.current.field}
                  uiField={active.data.current.uiField}
                  isClone={true}
                />
              )
            ) : (
              <SortableFieldWrapper key={key} fieldId={key} />
            ),
          )}
        </SortableContext>
      )}
    </div>
  );
}
