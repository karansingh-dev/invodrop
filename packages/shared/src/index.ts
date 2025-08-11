export * from "./schemas/index";
export * from "./constants/countries-currencies";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
}
