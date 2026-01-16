export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});
export const formatCurrency = (value = 0) =>
  typeof value === "number" ? currencyFormatter.format(value) : "$0";