export const getCurrencySymbol = (code: string) => {
  return (0)
    .toLocaleString("en", {
      style: "currency",
      currency: code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
    .replace(/\d/g, "")
    .trim();
};
