# Reglas generales de diseño

- **Un acento, un color.** Solo `--zirel-dorado-beige` como acento. No introducir colores extra.
- **Sin grises neutros.** Todos los grises están teñidos con el tono cálido de la paleta.
- **Transiciones:** `duration-200` para hover/focus y cambios de color en rows.
- **Scroll:** `scroll-behavior: smooth` definido globalmente.
- **`color-mix()`** para transparencias de marca — no usar `opacity` en el elemento si afecta al contenido hijo.
- **Z-index noise overlay:** `9998`. Cualquier overlay/modal debe usar `z-50` o superior, capas decorativas sin superar `9997`.
