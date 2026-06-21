"use client"

import * as React from "react"
import { useFormContext } from "react-hook-form"
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface TextFieldProps {
  name: string
  label: string
  description?: string
  placeholder?: string
  type?: React.HTMLInputTypeAttribute
  /** Renderiza un Textarea en lugar de Input */
  multiline?: boolean
  className?: string
  inputClassName?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  autoComplete?: string
}

export function TextField({
  name,
  label,
  description,
  placeholder,
  type = "text",
  multiline = false,
  className,
  inputClassName,
  required,
  disabled,
  readOnly,
  autoComplete,
}: TextFieldProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-[10px] tracking-widest uppercase text-foreground/70">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            {multiline ? (
              <Textarea
                placeholder={placeholder}
                disabled={disabled}
                autoComplete={autoComplete}
                className={cn(
                  "rounded-none mt-0 px-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)]",
                  inputClassName
                )}
                {...field}
                value={field.value ?? ""}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoComplete={autoComplete}
                className={cn(
                  "rounded-none mt-0 px-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)]",
                  readOnly && "cursor-default opacity-70 select-none focus-visible:ring-0",
                  inputClassName
                )}
                {...field}
                value={field.value ?? ""}
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
