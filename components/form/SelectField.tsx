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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  name: string
  label: string
  options: SelectOption[]
  description?: string
  placeholder?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export function SelectField({
  name,
  label,
  options,
  description,
  placeholder = "Seleccionar...",
  className,
  required,
  disabled,
}: SelectFieldProps) {
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
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger
                className={cn(
                  "w-full rounded-none border border-[var(--zirel-arena)] focus-visible:ring-[var(--zirel-dorado-beige)]"
                )}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
