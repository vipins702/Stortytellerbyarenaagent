export type VariantInput = { name: string; sku?: string; price?: number; stock?: number };

export function parseVariantLines(value: unknown): VariantInput[] {
  if (Array.isArray(value)) return value.filter((v) => v?.name).map((v) => ({ name: String(v.name), sku: v.sku ? String(v.sku) : undefined, price: v.price ? Number(v.price) : undefined, stock: v.stock ? Number(v.stock) : 0 }));
  if (typeof value !== "string") return [];
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [name, sku, price, stock] = line.split("|").map((part) => part?.trim());
    return { name, sku, price: price ? Math.round(Number(price) * 100) : undefined, stock: stock ? Number(stock) : 0 };
  });
}
