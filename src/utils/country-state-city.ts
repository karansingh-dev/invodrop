import { Country } from "country-state-city";

export function getCountryNameByCode(code: string) {
  if (!code || typeof code !== "string") return null;

  const country = Country.getCountryByCode(code.toUpperCase());

  return country?.name || null;
}
