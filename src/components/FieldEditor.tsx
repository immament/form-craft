import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  useFormCraftSchema,
  useFormCraftSelectedField,
  useFormCraftStoreActions,
} from "@/store/FormCraftStoreProvider";
import { FormField } from "@/types";

import { Plus, X, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

export function FieldEditor() {
  const { updateField, selectField } = useFormCraftStoreActions();
  const schema = useFormCraftSchema();
  // const { "ui:order": uiOrder } = useFormCraftUiSchema();

  const selectedField = useFormCraftSelectedField();
  const [newOption, setNewOption] = useState("");

  const field: FormField | undefined = useMemo(
    () => (selectedField ? schema.properties[selectedField] : undefined),
    [schema.properties, selectedField]
  );
  const properties = useMemo(
    () => Object.values(schema.properties),
    [schema.properties, selectedField]
  );

  if (!field) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Select a field to edit its properties
          </p>
        </CardContent>
      </Card>
    );
  }

  const addOption = () => {
    if (newOption.trim()) {
      const currentOptions = field.enum || [];
      updateField(field.$id, {
        enum: [...currentOptions, newOption.trim()],
      });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    const currentOptions = field.enum || [];
    updateField(field.$id, {
      enum: currentOptions.filter((_, i) => i !== index),
    });
  };

  const needsOptions =
    field.ui_widget === "select" || field.ui_widget === "radio";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <span className="flex-1">Field Properties</span>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => selectField(null)}
          >
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="field-label">Label</Label>
          <Input
            id="field-label"
            value={field.title}
            onChange={(e) => updateField(field.$id, { title: e.target.value })}
          />
        </div>

        {field.ui_widget !== "checkbox" && (
          <div>
            <Label htmlFor="field-placeholder">Placeholder</Label>
            <Input
              id="field-placeholder"
              value={field.ui_placeholder || ""}
              onChange={(e) =>
                updateField(field.$id, { ui_placeholder: e.target.value })
              }
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id="field-required"
            checked={field.ext_required || false}
            onCheckedChange={(checked) =>
              updateField(field.$id, { ext_required: checked })
            }
          />
          <Label htmlFor="field-required">Required</Label>
        </div>

        {needsOptions && (
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
        )}

        {(field.ui_widget === "text" ||
          field.ui_widget === "updown" ||
          field.ui_widget === "password" ||
          field.ui_widget === "textarea") && (
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
        )}

        {field.ui_widget === "email" && (
          <div>
            <Label htmlFor="email-message" className="text-xs">
              Custom Email Error Message
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

        <div className="space-y-3">
          <Label>Conditional Logic</Label>
          <div className="space-y-2">
            <div>
              <Label htmlFor="depends-on" className="text-xs">
                Show when field
              </Label>
              <select
                id="depends-on"
                className="w-full px-3 py-2 border rounded-md text-sm"
                value={field.conditional?.dependsOn || ""}
                onChange={(e) =>
                  updateField(field.$id, {
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
                  No dependency
                </option>
                {properties.map(
                  (f) =>
                    f.$id !== field.$id && (
                      <option
                        key={f.$id}
                        value={f.$id}
                        className="bg-background"
                      >
                        {f.title}
                      </option>
                    )
                )}
              </select>
            </div>

            {field.conditional?.dependsOn && (
              <>
                <div>
                  <Label htmlFor="condition" className="text-xs">
                    Condition
                  </Label>
                  <select
                    id="condition"
                    className="w-full px-3 py-2 border rounded-md text-sm"
                    value={field.conditional.condition}
                    onChange={(e) =>
                      updateField(field.$id, {
                        conditional: {
                          dependsOn: field.conditional!.dependsOn,
                          condition: e.target.value as any,
                          value: field.conditional!.value || "",
                        },
                      })
                    }
                  >
                    <option
                      key={"equals"}
                      value="equals"
                      className="bg-background"
                    >
                      Equals
                    </option>
                    <option
                      key={"not_equals"}
                      value="not_equals"
                      className="bg-background"
                    >
                      Not equals
                    </option>
                    <option
                      key={"not_empty_equals"}
                      value="not_empty_equals"
                      className="bg-background"
                    >
                      Not empty not equals
                    </option>
                    <option
                      key={"contains"}
                      value="contains"
                      className="bg-background"
                    >
                      Contains
                    </option>
                    <option
                      key={"not_empty"}
                      value="not_empty"
                      className="bg-background"
                    >
                      Is not empty
                    </option>
                  </select>
                </div>

                {field.conditional.condition !== "not_empty" && (
                  <div>
                    <Label htmlFor="condition-value" className="text-xs">
                      Value
                    </Label>
                    <Input
                      id="condition-value"
                      placeholder="Condition value"
                      value={field.conditional.value || ""}
                      onChange={(e) =>
                        updateField(field.$id, {
                          conditional: {
                            dependsOn: field.conditional!.dependsOn,
                            condition: field.conditional!.condition,
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
      </CardContent>
    </Card>
  );
}
