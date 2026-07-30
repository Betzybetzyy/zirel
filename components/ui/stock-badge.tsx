const LOW_STOCK_THRESHOLD = 3;

/** "Agotado" o "Últimas N piezas" — nada si hay stock de sobra. Un solo acento (dorado), sin colores nuevos. */
export function StockBadge({ stock, className = "" }: { stock: number; className?: string }) {
  if (stock <= 0) {
    return (
      <span className={`text-[9px] tracking-[0.3em] uppercase text-[var(--zirel-marfil)] bg-[var(--zirel-negro-suave)]/80 px-2 py-1 ${className}`}>
        Agotado
      </span>
    );
  }

  if (stock <= LOW_STOCK_THRESHOLD) {
    return (
      <span className={`text-[9px] tracking-[0.3em] uppercase text-[var(--zirel-negro-suave)] bg-[var(--zirel-dorado-beige)]/85 px-2 py-1 ${className}`}>
        {stock === 1 ? "Última pieza" : `Últimas ${stock} piezas`}
      </span>
    );
  }

  return null;
}
