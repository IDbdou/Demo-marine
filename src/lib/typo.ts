/**
 * Typographie française : espaces insécables avant « : ; ? ! » et « % », après « « »,
 * dans les nombres groupés (« 300 000 ») et avant les unités (« DH »).
 */
const NBSP = "\u00A0";

export function frTypo(input: string): string {
  return input
    .replace(/ ([:;?!»%])/g, `${NBSP}$1`)
    .replace(/« /g, `«${NBSP}`)
    .replace(/(\d) (\d{3})(?!\d)/g, `$1${NBSP}$2`)
    .replace(/(\d) (DH|jours?|pages?|min|Mo)\b/g, `$1${NBSP}$2`);
}

export function deepFrTypo<T>(value: T): T {
  if (typeof value === "string") return frTypo(value) as T;
  if (Array.isArray(value)) return value.map((v) => deepFrTypo(v)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, deepFrTypo(v)]),
    ) as T;
  }
  return value;
}
