import { FormCraft } from "@/store/FormCraft";
import { logger as log } from "@/utils/logger";
import ReactJsonView from "@microlink/react-json-view";
import { UiSchema } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";
import { ChevronsUpDown, Eye } from "lucide-react";
import { JsonFormExt } from "./JsonFormExt";
import { Button, Card, CardContent, CardHeader, CardTitle } from "./ui";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

const validator = customizeValidator({});

export function JsonFormPreviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Pré-visualização ao vivo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <JsonFormPreview />
      </CardContent>
    </Card>
  );
}

export function JsonFormPreview({
  withJsonSchams = false,
}: {
  withJsonSchams?: boolean;
}) {
  const jsonSchema = FormCraft.useSchema();
  const uiSchema = FormCraft.useUiSchema();

  return (
    <div className="flex flex-col gap-4 mb-4">
      <JsonFormExt
        schema={jsonSchema}
        validator={validator}
        uiSchema={uiSchema}
        noHtml5Validate={true}
        onChange={(e) => log.debug("onChange:", e.formData.country)}
        formData={{}}
        initialFormData={{}}
      />
      {withJsonSchams && (
        <JsonSchemas jsonSchema={jsonSchema} uiSchema={uiSchema} />
      )}
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
  return (
    <Collapsible className="flex flex-col gap-2">
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
