export function formatCurrency(value: number): string {
  return `₹${(Number.isFinite(value) ? value : 0).toLocaleString("en-IN")}`;
}
