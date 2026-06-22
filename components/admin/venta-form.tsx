"use client"

import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import {
  Plus,
  Trash2,
  Search,
  Minus,
  X,
  CreditCard,
  Banknote,
  CheckCircle2,
  CalendarClock,
  Wallet,
} from "lucide-react"
import { sileo } from "sileo"
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { TextField } from "@/components/form/TextField"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { formatCLP } from "@/lib/utils-format"
import { ventaSchema, type VentaInput } from "@/lib/schemas/venta"
import { createSale } from "@/app/actions/ventas"

interface ProductOption {
  id: string
  sku: string
  name: string
  price: number
  stock: number
}

interface VentaFormProps {
  products: ProductOption[]
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted-foreground)] shrink-0 font-semibold"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

// ── Searchable product combobox ──────────────────────────────────────────────
function ProductSearchInput({
  products,
  value,
  onChange,
  usedIds,
  error,
}: {
  products: ProductOption[]
  value: string
  onChange: (id: string) => void
  usedIds: string[]
  error?: boolean
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const selected = products.find((p) => p.id === value)

  const filtered = products.filter((p) => {
    if (usedIds.includes(p.id) && p.id !== value) return false
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return p.sku.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
  })

  useEffect(() => {
    setHighlighted(0)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function handleSelect(id: string) {
    onChange(id)
    setOpen(false)
    setQuery("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true)
      return
    }
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlighted((h) => Math.max(h - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (filtered[highlighted]) handleSelect(filtered[highlighted].id)
    } else if (e.key === "Escape") {
      setOpen(false)
      setQuery("")
    }
  }

  if (selected) {
    return (
      <div
        className={`flex items-center gap-2.5 h-10 px-3 border rounded-sm transition-colors ${
          error ? "border-destructive" : "border-[var(--zirel-arena)]"
        } bg-[color-mix(in_srgb,var(--muted)_40%,transparent)]`}
      >
        <span
          className="font-mono text-[10px] text-[var(--muted-foreground)] shrink-0 bg-[var(--muted)] px-1.5 py-0.5 rounded-sm"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {selected.sku}
        </span>
        <span
          className="text-sm flex-1 truncate text-[var(--foreground)]"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {selected.name}
        </span>
        <span
          className="text-xs text-[var(--muted-foreground)] shrink-0 tabular-nums"
          style={{ fontFamily: "var(--font-nunito)" }}
        >
          {formatCLP(selected.price)}
        </span>
        <button
          type="button"
          onClick={() => onChange("")}
          className="shrink-0 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-0.5 rounded-sm hover:bg-[var(--muted)]"
          aria-label="Quitar producto"
        >
          <X className="size-3" />
        </button>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-[var(--muted-foreground)] pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Buscar por SKU o nombre…"
          className={`w-full h-10 pl-9 pr-3 text-sm border rounded-sm bg-transparent
            focus:outline-none focus:ring-1 focus:ring-[var(--zirel-dorado-beige)]
            placeholder:text-[var(--muted-foreground)]/50 text-[var(--foreground)] transition-colors
            ${error ? "border-destructive" : "border-[var(--zirel-arena)]"}`}
          style={{ fontFamily: "var(--font-nunito)" }}
        />
      </div>

      {open && (
        <div
          ref={listRef}
          className="absolute z-50 top-full left-0 right-0 mt-1 max-h-56 overflow-y-auto
            border border-[var(--border)] bg-[var(--card)] shadow-lg rounded-sm"
        >
          {filtered.length === 0 ? (
            <div
              className="px-4 py-5 text-sm text-center text-[var(--muted-foreground)]"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Sin resultados para &ldquo;{query}&rdquo;
            </div>
          ) : (
            filtered.map((p, i) => (
              <button
                key={p.id}
                type="button"
                disabled={p.stock === 0}
                onClick={() => handleSelect(p.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${
                    i === highlighted
                      ? "bg-[color-mix(in_srgb,var(--muted)_60%,transparent)] text-[var(--zirel-dorado-beige)]"
                      : "hover:bg-[color-mix(in_srgb,var(--muted)_40%,transparent)]"
                  }`}
                onMouseEnter={() => setHighlighted(i)}
              >
                <span
                  className="font-mono text-[10px] text-[var(--muted-foreground)] w-[4.5rem] shrink-0"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {p.sku}
                </span>
                <span
                  className="flex-1 truncate text-sm text-[var(--foreground)]"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {p.name}
                </span>
                <span
                  className="text-xs text-[var(--muted-foreground)] shrink-0 tabular-nums"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {formatCLP(p.price)}
                </span>
                <span
                  className={`text-[10px] shrink-0 font-medium tabular-nums ${
                    p.stock === 0
                      ? "text-destructive"
                      : p.stock <= 2
                      ? "text-amber-400"
                      : "text-[var(--muted-foreground)]"
                  }`}
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {p.stock === 0 ? "sin stock" : `stock: ${p.stock}`}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ── Quantity +/- control ─────────────────────────────────────────────────────
function QuantityControl({
  value,
  onChange,
  max,
}: {
  value: number
  onChange: (v: number) => void
  max?: number
}) {
  return (
    <div className="flex items-center h-10 border border-[var(--zirel-arena)] rounded-sm overflow-hidden">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, (value || 1) - 1))}
        disabled={(value || 1) <= 1}
        className="flex items-center justify-center w-8 h-full shrink-0
          text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Minus className="size-3" />
      </button>
      <span
        className="flex-1 text-center text-sm font-semibold tabular-nums text-[var(--foreground)] select-none min-w-[2rem]"
        style={{ fontFamily: "var(--font-nunito)" }}
      >
        {value || 1}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max ?? 999, (value || 1) + 1))}
        disabled={max !== undefined && (value || 1) >= max}
        className="flex items-center justify-center w-8 h-full shrink-0
          text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]
          disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <Plus className="size-3" />
      </button>
    </div>
  )
}

// ── Payment method pills ─────────────────────────────────────────────────────
const PAYMENT_OPTIONS = [
  { value: "EFECTIVO", label: "Efectivo", icon: Banknote },
  { value: "TRANSFERENCIA", label: "Transferencia", icon: CreditCard },
  { value: "CUOTAS", label: "Cuotas", icon: CalendarClock },
  { value: "ABONO", label: "Abono", icon: Wallet },
] as const

function PaymentPills({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {PAYMENT_OPTIONS.map(({ value: v, label, icon: Icon }) => {
        const active = value === v
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-sm border text-sm font-medium transition-all
              ${
                active
                  ? "border-[var(--zirel-dorado-beige)] bg-[color-mix(in_srgb,var(--zirel-dorado-beige)_12%,transparent)] text-[var(--zirel-dorado-beige)]"
                  : "border-[var(--zirel-arena)] text-[var(--muted-foreground)] hover:border-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            <Icon className="size-4 shrink-0" />
            {label}
            {active && <CheckCircle2 className="size-3.5 shrink-0 ml-0.5" />}
          </button>
        )
      })}
    </div>
  )
}

// ── Credit/payment sub-field ─────────────────────────────────────────────────
function CreditField({
  name,
  label,
  placeholder,
  min,
  max,
  prefix,
  hint,
  hintColor = "muted",
}: {
  name: string
  label: string
  placeholder?: string
  min?: number
  max?: number
  prefix?: string
  hint?: string
  hintColor?: "muted" | "amber"
}) {
  const { control } = useFormContext()
  return (
    <FormField
      control={control}
      name={name}
      render={({ field: f, fieldState }) => (
        <FormItem className="space-y-1">
          <label
            className="block text-[10px] font-semibold tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
            style={{ fontFamily: "var(--font-nunito)" }}
          >
            {label}
          </label>
          <FormControl>
            <div className="relative">
              {prefix && (
                <span
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)] pointer-events-none select-none"
                  style={{ fontFamily: "var(--font-nunito)" }}
                >
                  {prefix}
                </span>
              )}
              <Input
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                placeholder={placeholder}
                value={f.value ?? ""}
                onChange={f.onChange}
                className={cn(
                  "h-10 rounded-sm border border-[var(--zirel-arena)] bg-transparent tabular-nums",
                  "focus-visible:ring-[var(--zirel-dorado-beige)]",
                  prefix ? "pl-7 pr-3" : "px-3",
                  fieldState.error && "border-destructive"
                )}
                style={{ fontFamily: "var(--font-nunito)" }}
              />
            </div>
          </FormControl>
          {hint && (
            <p
              className={cn(
                "text-[10px] leading-none",
                hintColor === "amber" ? "text-amber-500" : "text-[var(--muted-foreground)]"
              )}
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              {hint}
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// ── Main form ────────────────────────────────────────────────────────────────
export function VentaForm({ products }: VentaFormProps) {
  const router = useRouter()

  const form = useForm<VentaInput>({
    resolver: zodResolver(ventaSchema),
    defaultValues: {
      customerName: "",
      customerNotes: "",
      paymentMethod: "EFECTIVO",
      items: [{ productId: "", quantity: 1 }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchedItems = form.watch("items")
  const watchedMethod = form.watch("paymentMethod")
  const watchedInitialPayment = form.watch("initialPayment")
  const watchedInstallments = form.watch("installmentCount")
  const productMap = new Map(products.map((p) => [p.id, p]))

  const liveTotal = watchedItems.reduce((sum, item) => {
    const p = productMap.get(item.productId)
    if (!p || !item.quantity) return sum
    return sum + p.price * item.quantity
  }, 0)

  const isCreditMethod = watchedMethod === "CUOTAS" || watchedMethod === "ABONO"
  const initPaid = Number(watchedInitialPayment) || 0
  const liveSaldo = isCreditMethod ? liveTotal - initPaid : 0

  const onSubmit = form.handleSubmit(async (data) => {
    const result = await createSale(data)
    if (!result.success) {
      form.setError("root", { message: result.error })
      return
    }
    sileo.success({
      title: "Venta registrada",
      description: `Venta #${result.sale.saleNumber} registrada correctamente.`,
    })
    form.reset()
    router.push("/admin/ventas")
    router.refresh()
  })

  const usedIds = watchedItems.map((i) => i.productId).filter(Boolean)

  return (
    <Form {...form}>
      <form onSubmit={onSubmit}>
        <div className="space-y-8">

          {/* ── Productos ── */}
          <div className="space-y-4">
            <SectionLabel label="Productos" />

            <div
              className="hidden md:grid grid-cols-[1fr_100px_96px_32px] gap-3
                text-[10px] font-semibold tracking-[0.15em] uppercase
                text-[var(--muted-foreground)]
                bg-[color-mix(in_srgb,var(--muted)_22%,transparent)]
                px-3 py-2 rounded-sm"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <span>Producto</span>
              <span className="text-center">Cant.</span>
              <span className="text-center">Subtotal</span>
              <span />
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => {
                const selectedProduct = productMap.get(
                  watchedItems[index]?.productId ?? ""
                )
                const qty = watchedItems[index]?.quantity ?? 1
                const lineTotal = selectedProduct ? selectedProduct.price * (qty || 0) : 0

                return (
                  <div
                    key={field.id}
                    className="grid md:grid-cols-[1fr_100px_96px_32px] gap-3 items-start"
                  >
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field: f, fieldState }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <ProductSearchInput
                              products={products}
                              value={f.value}
                              onChange={f.onChange}
                              usedIds={usedIds.filter((id) => id !== f.value)}
                              error={!!fieldState.error}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field: f }) => (
                        <FormItem className="space-y-1">
                          <FormControl>
                            <QuantityControl
                              value={f.value}
                              onChange={f.onChange}
                              max={selectedProduct?.stock}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div
                      className="flex items-center justify-center h-10 text-sm font-semibold
                        text-[var(--foreground)] tabular-nums"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      {lineTotal > 0 ? formatCLP(lineTotal) : (
                        <span className="text-[var(--muted-foreground)] font-normal">—</span>
                      )}
                    </div>

                    <div className="flex items-start pt-1.5">
                      <button
                        type="button"
                        disabled={fields.length === 1}
                        onClick={() => remove(index)}
                        className="size-7 flex items-center justify-center rounded-sm
                          text-[var(--foreground)]/60 hover:text-destructive
                          hover:bg-destructive/10 disabled:opacity-30 disabled:cursor-not-allowed
                          transition-colors"
                        aria-label="Quitar línea"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => append({ productId: "", quantity: 1 })}
              className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase
                text-[var(--muted-foreground)] hover:text-[var(--foreground)]
                transition-colors py-1"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              <Plus className="size-3.5" />
              Agregar producto
            </button>

            {form.formState.errors.items?.root && (
              <p className="text-sm text-destructive">
                {form.formState.errors.items.root.message}
              </p>
            )}
            {typeof form.formState.errors.items?.message === "string" && (
              <p className="text-sm text-destructive">
                {form.formState.errors.items.message}
              </p>
            )}
          </div>

          {/* ── Pago ── */}
          <div className="space-y-4">
            <SectionLabel label="Pago" />
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field: f }) => (
                <FormItem>
                  <FormControl>
                    <PaymentPills value={f.value} onChange={(v) => {
                      f.onChange(v)
                      // Reset credit fields when switching away
                      if (v !== "CUOTAS") form.setValue("installmentCount", undefined)
                      if (v !== "CUOTAS" && v !== "ABONO") form.setValue("initialPayment", undefined)
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ── Campos adicionales para CUOTAS ── */}
            {watchedMethod === "CUOTAS" && (
              <div className="space-y-3 pt-1">
                <div className="grid sm:grid-cols-2 gap-4 items-start">
                  <CreditField
                    name="installmentCount"
                    label="Número de cuotas"
                    placeholder="Ej: 3"
                    min={2}
                    max={60}
                  />
                  <CreditField
                    name="initialPayment"
                    label="Abono inicial (opcional)"
                    placeholder="10000"
                    min={0}
                    prefix="$"
                  />
                </div>

                {/* Plan de pago preview */}
                {liveTotal > 0 && watchedInstallments != null && watchedInstallments >= 2 ? (
                  <div
                    className="rounded-sm border border-[var(--zirel-arena)] bg-[color-mix(in_srgb,var(--muted)_30%,transparent)] px-4 py-3 space-y-1.5"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {initPaid > 0 && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--muted-foreground)] tracking-wide">Abono inicial</span>
                        <span className="tabular-nums text-[var(--zirel-cafe-topo)] font-semibold">
                          {formatCLP(initPaid)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[var(--muted-foreground)] tracking-wide">
                        {watchedInstallments} cuotas de
                      </span>
                      <span className="tabular-nums text-[var(--foreground)] font-semibold">
                        {formatCLP(Math.round(Math.max(0, liveTotal - initPaid) / watchedInstallments))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] border-t border-[var(--zirel-arena)] pt-1.5">
                      <span className="text-[var(--muted-foreground)] tracking-wide">
                        {initPaid > 0 ? "Saldo a financiar" : "Total"}
                      </span>
                      <span className={`tabular-nums font-semibold ${initPaid > 0 ? "text-amber-500" : "text-[var(--foreground)]"}`}>
                        {formatCLP(Math.max(0, liveTotal - initPaid))}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p
                    className="text-[10px] text-[var(--muted-foreground)]/60 leading-none"
                    style={{ fontFamily: "var(--font-nunito)" }}
                  >
                    {liveTotal === 0
                      ? "Agrega productos para ver el plan de cuotas."
                      : "Indica el número de cuotas para ver el desglose."}
                  </p>
                )}
              </div>
            )}

            {/* ── Campo adicional para ABONO ── */}
            {watchedMethod === "ABONO" && (
              <div className="max-w-xs pt-1">
                <CreditField
                  name="initialPayment"
                  label="Abono inicial (opcional)"
                  placeholder="10000"
                  min={0}
                  prefix="$"
                  hint={
                    initPaid > 0 && liveTotal > 0
                      ? `Saldo pendiente: ${formatCLP(Math.max(0, liveTotal - initPaid))}`
                      : undefined
                  }
                  hintColor="amber"
                />
              </div>
            )}
          </div>

          {/* ── Cliente (opcional) ── */}
          <div className="space-y-4">
            <SectionLabel label="Cliente (opcional)" />
            <div className="grid md:grid-cols-2 gap-4">
              <TextField
                name="customerName"
                label="Nombre del cliente"
                placeholder="Ej: María González"
              />
              <TextField
                name="customerNotes"
                label="Notas"
                multiline
                placeholder="Instrucciones o referencias…"
              />
            </div>
          </div>

          {/* ── Error global ── */}
          {form.formState.errors.root && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-sm bg-destructive/10 border border-destructive/30">
              <p className="text-sm text-destructive">
                {form.formState.errors.root.message}
              </p>
            </div>
          )}

          {/* ── Footer: Total + actions ── */}
          <div className="flex items-center justify-between gap-4 pt-5 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => router.push("/admin/ventas")}
              disabled={form.formState.isSubmitting}
              className="text-[10px] tracking-widest uppercase text-[var(--foreground)]/50
                hover:text-[var(--foreground)] transition-colors disabled:opacity-40"
              style={{ fontFamily: "var(--font-nunito)" }}
            >
              Cancelar
            </button>

            <div className="flex items-center gap-6">
              <div className="text-right space-y-0.5">
                {isCreditMethod && initPaid > 0 && liveTotal > 0 ? (
                  <>
                    <div className="flex items-center gap-3 justify-end">
                      <span
                        className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Total
                      </span>
                      <span
                        className="text-lg font-bold text-[var(--zirel-negro-suave)] tabular-nums"
                        style={{ fontFamily: "var(--font-baskerville)" }}
                      >
                        {formatCLP(liveTotal)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span
                        className="text-[10px] tracking-[0.15em] uppercase text-[var(--muted-foreground)]"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Abona ahora
                      </span>
                      <span
                        className="text-sm font-semibold text-[var(--zirel-cafe-topo)] tabular-nums"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {formatCLP(initPaid)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-end">
                      <span
                        className="text-[10px] tracking-[0.15em] uppercase text-amber-500"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Saldo pendiente
                      </span>
                      <span
                        className="text-sm font-semibold text-amber-500 tabular-nums"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        {formatCLP(Math.max(0, liveSaldo))}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <span
                      className="block text-[10px] tracking-[0.18em] uppercase text-[var(--muted-foreground)]"
                      style={{ fontFamily: "var(--font-nunito)" }}
                    >
                      Total
                    </span>
                    <span
                      className="text-2xl font-bold text-[var(--zirel-negro-suave)] tabular-nums"
                      style={{ fontFamily: "var(--font-baskerville)" }}
                    >
                      {liveTotal > 0 ? formatCLP(liveTotal) : "—"}
                    </span>
                    {isCreditMethod && liveTotal > 0 && (
                      <span
                        className="block text-[10px] text-amber-500"
                        style={{ fontFamily: "var(--font-nunito)" }}
                      >
                        Queda pendiente de pago
                      </span>
                    )}
                  </>
                )}
              </div>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-[var(--zirel-dorado-beige)] text-[#1e1a17] hover:bg-[var(--zirel-dorado-claro)]
                  border-0 font-semibold text-[10px] tracking-widest uppercase px-6 h-10
                  transition-colors disabled:opacity-60"
              >
                {form.formState.isSubmitting ? "Registrando…" : "Registrar venta"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
