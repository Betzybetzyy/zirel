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
import { cn } from "@/lib/utils"

interface DateFieldProps {
  name: string
  label: string
  description?: string
  className?: string
  inputClassName?: string
  required?: boolean
  disabled?: boolean
  min?: string
  max?: string
}

export function DateField({
  name,
  label,
  description,
  className,
  inputClassName,
  required,
  disabled,
  min,
  max,
}: DateFieldProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel className="text-[10px] tracking-widest uppercase text-[var(--zirel-cafe-topo)]">
            {label}
            {required && <span className="text-destructive ml-0.5">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="date"
              disabled={disabled}
              min={min}
              max={max}
              className={cn(
                "rounded-none mt-0 px-3 border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)]",
                inputClassName
              )}
              {...field}
              value={field.value ?? ""}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
