import { FormCraft } from "@/store/FormCraftStore.provider";
import ReactJsonView from "@microlink/react-json-view";
import { UiSchema } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";
import { ChevronsUpDown, Eye } from "lucide-react";
import { useMemo } from "react";
import { JsonFormExt } from "./JsonFormExt";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

//ptLocalizer
const validator = customizeValidator({});

export function JsonFormPreviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Json Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <JsonFormPreview />
      </CardContent>
    </Card>
  );
}

export function JsonFormPreview() {
  const schema = FormCraft.useSchema();
  const { exportJsonSchema } = FormCraft.useActions();

  const { jsonSchema, uiSchema, jsonSchemaFiltered } = useMemo(() => {
    const { jsonSchema, uiSchema } = exportJsonSchema();
    validator.reset();
    return {
      jsonSchema,
      jsonSchemaFiltered: deleteUndefined(jsonSchema),
      uiSchema,
    };
  }, [exportJsonSchema, schema, validator]);
  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* <JsonFormExt
          schema={originalSchema}
          uiSchema={originalUISchema}
          formData={originalFormData}
        /> */}
      <JsonFormExt
        schema={jsonSchema}
        validator={validator}
        uiSchema={uiSchema}
        noHtml5Validate={true}
        onChange={(e) => console.log("onChange:", e.formData.country)}
        formData={{}}
        initialFormData={{}}
        // experimental_defaultFormStateBehavior={{
        //   constAsDefaults: "always",
        //   emptyObjectFields: "populateAllDefaults",
        // }}

        // templates={{ FieldTemplate: CustomFieldTemplate }}
      />
      <JsonSchemas jsonSchema={jsonSchemaFiltered} uiSchema={uiSchema} />
    </div>
  );
}

export function JsonSchemas({
  jsonSchema,
  uiSchema,
}: {
  jsonSchema: Partial<JSONSchema7>;
  uiSchema: UiSchema;
}) {
  // const [isOpen, setIsOpen] = useState(true);
  return (
    <Collapsible
      // open={isOpen}
      // onOpenChange={setIsOpen}
      className="flex flex-col gap-2"
    >
      <CollapsibleTrigger asChild>
        <Button variant="secondary" size="sm">
          <div className="flex items-center justify-between gap-4 w-full">
            <h4 className="text-sm font-semibold">Json Schema</h4>
            <ChevronsUpDown />
            <span className="sr-only">Toggle</span>
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="flex flex-col gap-2">
        <div>
          <div className="mb-1">Json Schema</div>
          <ReactJsonView
            src={jsonSchema}
            theme={"harmonic"}
            displayObjectSize={false}
            name="Json Schema"
            displayDataTypes={false}
          />
        </div>
        <div>
          <div className="mb-1">UI Schema</div>
          <ReactJsonView
            src={uiSchema}
            theme={"harmonic"}
            displayObjectSize={false}
            name="UI Schema"
            displayDataTypes={false}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function deleteUndefined<T extends object>(obj: T): Partial<T> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value === undefined) return acc;
    // WARN:  not modify arrays
    if (Array.isArray(value)) {
      acc[key as keyof T] = value as T[keyof T];
    } else if (typeof value === "object" && !Array.isArray(value))
      acc[key as keyof T] = deleteUndefined(value) as typeof value;
    else acc[key as keyof T] = value;
    return acc;
  }, {} as Partial<T>);
}
