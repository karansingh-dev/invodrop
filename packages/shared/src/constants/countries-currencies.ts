export const SUPPORTED_COUNTRIES = [
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "DE", name: "Germany", currency: "EUR" },
  { code: "IN", name: "India", currency: "INR" },
];

export const SUPPORTED_CURRENCIES = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

export const isCountrySupported = (countryCode: string) => {
  return SUPPORTED_COUNTRIES.some((country) => country.code === countryCode);
};

export const isCurrencySupported = (currencyCode: string) => {
  return SUPPORTED_CURRENCIES.some(
    (currency) => currency.code === currencyCode
  );
};

export const getCountryCurrency = (countryCode: string) => {
  const country = SUPPORTED_COUNTRIES.find((c) => c.code === countryCode);
  return country?.currency || null;
};
