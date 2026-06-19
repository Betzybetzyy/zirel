// Mensajes de validación estándar en español para todos los formularios

export const msg = {
  required: "Este campo es obligatorio",
  email: "Email inválido",
  min: (n: number) => `Mínimo ${n} caracteres`,
  max: (n: number) => `Máximo ${n} caracteres`,
  phone: "Teléfono inválido (mínimo 8 dígitos)",
  regex: (hint: string) => hint,
  number: {
    min: (n: number) => `Debe ser al menos ${n}`,
    max: (n: number) => `No puede superar ${n}`,
    positive: "Debe ser un número positivo",
    integer: "Debe ser un número entero",
  },
  price: "Precio inválido (debe ser mayor a 0)",
} as const
