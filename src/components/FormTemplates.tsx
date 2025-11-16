import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateId } from "@/lib/my-utils";
import { useFormCraftStoreActions } from "@/store/FormCraftStoreProvider";
import { FormSchema } from "@/types";
import { FileText, MessageSquare, ShoppingCart, User } from "lucide-react";

const templates: Array<{
  name: string;
  icon: React.ReactNode;
  schema: Omit<FormSchema, "id">;
}> = [
  {
    name: "Contact Form",
    icon: <MessageSquare className="w-4 h-4" />,
    schema: {
      title: "Contact Us",
      description: "Get in touch with us",
      fields: [
        {
          id: generateId(),
          ui_widget: "text",
          title: "Full Name",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "email",
          title: "Email Address",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "tel",
          title: "Phone Number",
          ext_required: false,
        },
        {
          id: generateId(),
          ui_widget: "select",
          title: "Subject",
          ext_required: true,
          enum: ["General Inquiry", "Support", "Sales", "Other"],
        },
        {
          id: generateId(),
          ui_widget: "textarea",
          title: "Message",
          ext_required: true,
          ui_placeholder: "Tell us how we can help...",
        },
      ],
    },
  },
  {
    name: "Registration Form",
    icon: <User className="w-4 h-4" />,
    schema: {
      title: "User Registration",
      description: "Create your account",
      fields: [
        {
          id: generateId(),
          ui_widget: "text",
          title: "First Name",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "text",
          title: "Last Name",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "email",
          title: "Email",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "password",
          title: "Password",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "date",
          title: "Date of Birth",
          ext_required: false,
        },
        {
          id: generateId(),
          ui_widget: "select",
          title: "Gender",
          ext_required: false,
          enum: ["Male", "Female", "Other", "Prefer not to say"],
        },
        {
          id: generateId(),
          ui_widget: "checkbox",
          title: "I agree to the terms and conditions",
          ext_required: true,
        },
      ],
    },
  },
  {
    name: "Survey Form",
    icon: <FileText className="w-4 h-4" />,
    schema: {
      title: "Customer Feedback Survey",
      description: "Help us improve our service",
      fields: [
        {
          id: generateId(),
          ui_widget: "radio",
          title: "How satisfied are you?",
          ext_required: true,
          enum: [
            "Very Satisfied",
            "Satisfied",
            "Neutral",
            "Dissatisfied",
            "Very Dissatisfied",
          ],
        },
        {
          id: generateId(),
          ui_widget: "select",
          title: "How did you hear about us?",
          ext_required: false,
          enum: ["Google", "Social Media", "Friend", "Advertisement", "Other"],
        },
        {
          id: generateId(),
          ui_widget: "checkbox",
          title: "Would you recommend us to others?",
          ext_required: false,
        },
        {
          id: generateId(),
          ui_widget: "textarea",
          title: "Additional Comments",
          ext_required: false,
          ui_placeholder: "Share your thoughts...",
        },
      ],
    },
  },
  {
    name: "Order Form",
    icon: <ShoppingCart className="w-4 h-4" />,
    schema: {
      title: "Product Order",
      description: "Place your order",
      fields: [
        {
          id: generateId(),
          ui_widget: "text",
          title: "Customer Name",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "email",
          title: "Email",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "select",
          title: "Product",
          ext_required: true,
          enum: ["Basic Plan", "Pro Plan", "Enterprise Plan"],
        },
        {
          id: generateId(),
          ui_widget: "updown",
          title: "Quantity",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "textarea",
          title: "Shipping Address",
          ext_required: true,
        },
        {
          id: generateId(),
          ui_widget: "tel",
          title: "Phone Number",
          ext_required: true,
        },
      ],
    },
  },
];

export function FormTemplates() {
  const { loadTemplate } = useFormCraftStoreActions();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Templates</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {templates.map((template) => (
          <Button
            key={template.name}
            variant="outline"
            className="w-full justify-start h-auto p-3"
            onClick={() => loadTemplate(template.schema)}
          >
            <div className="flex items-center space-x-2">
              {template.icon}
              <div className="text-left">
                <div className="font-medium text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground">
                  {template.schema.fields.length} fields
                </div>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function getTemplate(name: string) {
  return templates.find((template) => template.name === name);
}
