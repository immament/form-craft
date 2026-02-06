import { getDefaultRegistry } from "@rjsf/core";
import type { WidgetProps } from "@rjsf/utils";

const {
  widgets: { TextWidget },
} = getDefaultRegistry();

export const AutoFieldWidget = (props: WidgetProps) => {
  return <TextWidget {...props} disabled={true} />;
};
