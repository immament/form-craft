import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { FormCraft } from "@/store/FormCraftStore.provider";
import {
  AppUiSchemaField,
  ConditionalRule,
  FormField,
  FormFieldUpdate,
} from "@/types";
import { Plus, X, XIcon } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup } from "./ui/field";

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
        <UpdateIdField key={field.$id} fieldId={field.$id} />
      </CardContent>
    </Card>
  );
}

const formSchema = z.object({
  fieldId: z
    .string()
    .min(3, "O ID deve ter pelo menos 3 caracteres.")
    .max(50, "O ID deve ter um máximo de 50 caracteres.")
    .regex(
      /^[A-Za-z0-9][A-Za-z0-9_]+$/,
      "O ID só pode conter letras e o caractere de sublinhado.",
    ),
});

function UpdateIdField({ fieldId }: { fieldId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldId: fieldId,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(JSON.stringify(data, null, 2));
  }

  return (
    <form id="form-field-id" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="fieldId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <Label htmlFor={field.name}>DEV: Field Id</Label>
              <InputGroup>
                <InputGroupInput
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                <InputGroupButton
                  variant="secondary"
                  type="submit"
                  form="form-field-id"
                >
                  Update
                </InputGroupButton>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );

  // return (
  //   <div>
  //     <Label htmlFor="field-id">DEV: Field Id</Label>
  //     <InputGroup>
  //       <InputGroupInput
  //         id="field-id"
  //         ref={inputRef}
  //         value={tmpId}
  //         onChange={(e) => setTmpId(e.target.value)}
  //         pattern="^[A-Za-z_]+$"
  //         onInvalid={(e) => {
  //           e.currentTarget.formNoValidate;
  //         }}
  //       />
  //       <InputGroupButton
  //         // size="sm"
  //         variant="secondary"
  //         onClick={() => {
  //           if (tmpId) {
  //             console.log(
  //               "validity:",
  //               inputRef.current?.validity.valid,
  //               inputRef.current?.validationMessage,
  //               inputRef.current?.formNoValidate,
  //             );
  //             if (inputRef.current?.validity.valid) {
  //               updateFieldId(fieldId, tmpId);
  //             }
  //           }
  //         }}
  //         disabled={!tmpId || tmpId === fieldId}
  //       >
  //         Update
  //       </InputGroupButton>
  //     </InputGroup>
  //   </div>
  // );
}

function ConditionalLogic({
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

function RenderOptions({
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
      <Label>Options</Label>
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

function ValidationRules({
  field,
  updateField,
}: {
  field: FormField;
  updateField: (id: string, updates: FormFieldUpdate) => void;
}) {
  return (
    <div className="space-y-3">
      <Label>Validation Rules</Label>

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
          Regex Pattern
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
          Custom Error Message
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
