import { FormStore } from "./FormStore";

export function store_extractReactComponent(
  get: () => FormStore
): () => string {
  return () => {
    const { schema } = get();

    // Generate Zod schema
    const zodSchema = `const formSchema = z.object({\n${schema.fields
      .map((field) => {
        let zodType = "";
        switch (field.ui_widget) {
          case "text":
          case "textarea":
            zodType = "z.string()";
            if (field.validation?.min)
              zodType += `.min(${field.validation.min}${
                field.validation.message
                  ? `, { message: "${field.validation.message}" }`
                  : ""
              })`;
            if (field.validation?.max)
              zodType += `.max(${field.validation.max})`;
            if (field.validation?.pattern)
              zodType += `.regex(/${field.validation.pattern}/)`;
            break;
          case "email":
            zodType = "z.string().email()";
            break;
          case "password":
            zodType = field.validation?.min
              ? `z.string().min(${field.validation.min}${
                  field.validation.message
                    ? `, { message: "${field.validation.message}" }`
                    : ""
                })`
              : "z.string().min(6)";
            if (field.validation?.max)
              zodType = zodType.replace(")", `.max(${field.validation.max})`);
            if (field.validation?.pattern)
              zodType = zodType.replace(
                ")",
                `.regex(/${field.validation.pattern}/)`
              );
            break;
          case "uri":
            zodType = "z.string().url()";
            break;
          case "tel":
            zodType = "z.string()";
            break;
          case "date":
          case "time":
          case "date-time":
            zodType = "z.string()";
            break;
          case "data-url":
            zodType = "z.any()";
            break;
          case "updown":
            zodType =
              field.validation?.min || field.validation?.max
                ? `z.number()${
                    field.validation.min ? `.min(${field.validation.min})` : ""
                  }${
                    field.validation.max ? `.max(${field.validation.max})` : ""
                  }`
                : "z.number()";
            break;
          case "select":
          case "radio":
            zodType = field.enum
              ? `z.enum([${field.enum.map((opt) => `"${opt}"`).join(", ")}])`
              : "z.string()";
            break;
          case "checkbox":
            zodType = "z.boolean()";
            break;
          default:
            zodType = "z.string()";
        }
        if (!field.ext_required) zodType += ".optional()";
        return `  ${field.id}: ${zodType}`;
      })
      .join(",\n")}\n});`;

    return `/*
     * Generated React Component with TypeScript and Zod validation
     * 
     * Required dependencies:
     * npm install react-hook-form @hookform/resolvers zod
     * 
     * This is a TypeScript React component (.tsx file)
     */
    
    import React from 'react';
    import { useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    import { z } from 'zod';
    
    // Zod validation schema
    ${zodSchema}
    
    type FormData = z.infer<typeof formSchema>;
    
    export default function ${schema.title.replace(/\s+/g, "")}Form() {
      const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema)
      });
    
      const onSubmit = (data: FormData) => {
        console.log(data);
      };
    
      return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold">${schema.title}</h2>
            ${
              schema.description
                ? `<p className="text-gray-600">${schema.description}</p>`
                : ""
            }
          </div>
          
          ${schema.fields
            .map((field) => {
              switch (field.ui_widget) {
                case "text":
                case "email":
                case "password":
                case "updown":
                case "tel":
                case "uri":
                case "date":
                case "time":
                case "date-time":
                case "data-url":
                  return `<div>
            <label className="block text-sm font-medium mb-1">${
              field.title
            }</label>
            <input
              type="${field.ui_widget}"
              placeholder="${field.ui_placeholder || ""}"
              {...register('${field.id}', { required: ${field.ext_required} })}
              className="w-full px-3 py-2 border rounded-md"
            />
            {errors.${
              field.id
            } && <span className="text-red-500 text-sm">This field is required</span>}
          </div>`;
                case "textarea":
                  return `<div>
            <label className="block text-sm font-medium mb-1">${
              field.title
            }</label>
            <textarea
              placeholder="${field.ui_placeholder || ""}"
              {...register('${field.id}', { required: ${field.ext_required} })}
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
            />
            {errors.${
              field.id
            } && <span className="text-red-500 text-sm">This field is required</span>}
          </div>`;
                case "select":
                  return `<div>
            <label className="block text-sm font-medium mb-1">${
              field.title
            }</label>
            <select
              {...register('${field.id}', { required: ${field.ext_required} })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="" className="bg-background" className="bg-background">Select an option</option>
              ${field.enum
                ?.map((opt) => `<option value="${opt}">${opt}</option>`)
                .join("\n          ")}
            </select>
            {errors.${
              field.id
            } && <span className="text-red-500 text-sm">This field is required</span>}
          </div>`;
                case "checkbox":
                  return `<div className="flex items-center space-x-2">
            <input
              type="checkbox"
              {...register('${field.id}', { required: ${field.ext_required} })}
              className="rounded"
            />
            <label className="text-sm font-medium">${field.title}</label>
          </div>`;
                default:
                  return "";
              }
            })
            .join("\n      ")}
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Submit
          </button>
        </form>
      );
    }`;
  };
}
