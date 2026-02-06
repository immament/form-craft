import { FormCraft } from "@/store/FormCraft";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import z from "zod";
import { Label } from "../ui";
import { FieldGroup, Field, FieldError } from "../ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupButton,
} from "../ui/input-group";
import { getSubLogger } from "@/utils/logger";

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

const log = getSubLogger({ name: "FormEditor" });

export function UpdateFieldId({ fieldId }: { fieldId: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldId: fieldId,
    },
  });
  const { updateFieldId } = FormCraft.useActions();

  function onSubmit(data: z.infer<typeof formSchema>) {
    log.info(JSON.stringify(data, null, 2));

    updateFieldId(fieldId, data.fieldId);
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
}
