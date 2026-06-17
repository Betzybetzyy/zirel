# Zirel Joyería — E-commerce

Tienda en línea de joyería en plata 925. Next.js 16 + PostgreSQL (Neon) + Cloudinary.

## Stack

- **Framework:** Next.js 16 con Turbopack y React Compiler
- **Base de datos:** PostgreSQL vía Neon (serverless), ORM Prisma 7
- **Imágenes:** Cloudinary
- **UI:** Tailwind CSS v4 + shadcn/ui + Radix UI
- **Estado:** Zustand (carrito)

---

## Variables de entorno

Crea un archivo `.env` en la raíz con las siguientes variables:

```env
# Base de datos (Neon PostgreSQL)
DATABASE_URL=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# WhatsApp (número sin + ni espacios, ej: 56912345678)
NEXT_PUBLIC_WHATSAPP_NUMBER=
```

---

## Instalación y setup

### Opción A — Docker (recomendado para desarrollo local)

Solo necesitas Docker instalado. No se requiere PostgreSQL local ni cuenta Neon.

**1. Levantar la base de datos**

```bash
docker compose up db -d
```

Esto expone PostgreSQL en `localhost:5433`.

**2. Configurar `.env`**

```env
DATABASE_URL=postgresql://zirel:zirel@localhost:5433/zirel
# resto de variables (Cloudinary, WhatsApp)...
```

**3. Instalar dependencias y sincronizar schema**

```bash
npm install
npx prisma db push
```

**4. (Opcional) Seed de productos**

```bash
npm run db:seed
```

**5. Iniciar servidor de desarrollo**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

### Opción B — Stack completo en Docker

Levanta la BD y la app en producción dentro de contenedores:

```bash
docker compose --profile full up --build
```

Abre [http://localhost:3000](http://localhost:3000). La app corre en modo producción (`NODE_ENV=production`).

---

### Opción C — Sin Docker (Neon cloud)

**1. Instalar dependencias**

```bash
npm install
```

Esto también ejecuta `prisma generate` automáticamente via `postinstall`.

**2. Sincronizar schema con la base de datos**

```bash
npx prisma db push
```

**3. (Opcional) Seed de productos**

Requiere el archivo `seed-data/inventario.xlsx` y fotos en `seed-data/fotos/` organizadas por categoría (`anillos/`, `aros/`, `pulseras/`, `collares/`).

```bash
npm run db:seed
```

Para re-seedear solo algunos productos por SKU:

```bash
npm run db:seed -- --only=ANI-001,ANI-002
```

---

## Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Producción

```bash
# Build
npm run build

# Iniciar servidor
npm start
```

---

## Comandos de base de datos

| Comando | Descripción |
|---------|-------------|
| `npx prisma generate` | Regenera el cliente de Prisma tras cambios en el schema |
| `npx prisma db push` | Aplica el schema a la base de datos sin migraciones |
| `npx prisma studio` | Abre Prisma Studio (UI para explorar la BD) |
| `npm run db:seed` | Seed completo desde Excel + sube imágenes a Cloudinary |

---

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción con Turbopack |
| `npm start` | Inicia servidor de producción |
| `npm run lint` | Ejecuta ESLint |
| `npm run db:generate` | `prisma generate` |
| `npm run db:seed` | Seed de productos desde Excel |

---

## Estructura principal

```
app/
├── page.tsx                  # Home
├── catalogo/                 # Listado por categoría
├── producto/[slug]/          # Detalle de producto
├── carrito/                  # Carrito de compras
├── checkout/                 # Formulario de pedido
├── pedido-confirmado/        # Confirmación de orden
└── actions/                  # Server Actions (órdenes)

components/                   # Componentes reutilizables
lib/
├── prisma.ts                 # Singleton Prisma client
├── queries.ts                # Queries a la BD
├── cart-store.ts             # Estado del carrito (Zustand)
└── whatsapp.ts               # Integración WhatsApp

prisma/schema.prisma          # Schema de la BD
scripts/seed.ts               # Script de carga masiva
seed-data/
├── inventario.xlsx           # Inventario de productos
└── fotos/                    # Fotos por categoría
```
