/**
 * Registro de feature flags del sitio.
 * Este módulo no tiene "use server" — se puede importar desde client y server.
 */

export const FEATURE_FLAGS = [
  {
    key: "cart",
    label: "Carro de compra",
    description:
      'Muestra el carro, el botón "Agregar al carrito" y habilita /carrito y /checkout. Apágalo para modo solo-catálogo.',
    default: true,
  },
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAGS)[number]["key"];
export type FeatureFlagMap = Record<FeatureFlagKey, boolean>;

/** Flag enriquecido para el panel de admin (cubre estáticos + dinámicos de DB). */
export type AdminFlag = {
  key: string;
  label: string;
  description: string;
  enabled: boolean;
  isDynamic: boolean;
};

/** Construye un mapa con los valores default de todos los flags. */
export function buildFlagDefaults(): FeatureFlagMap {
  return Object.fromEntries(
    FEATURE_FLAGS.map((f) => [f.key, f.default])
  ) as FeatureFlagMap;
}
