import { ApiResponse } from "@repo/shared";
import { axiosInstance } from "./axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface ApiRequestOptions<TRequest = null> {
  method?: HttpMethod;
  data?: TRequest;
  params?: any;
  headers?: Record<string, string>;
  contentType?: string;
  customBaseUrl?: string;
  protected?: boolean;
}

export async function apiRequest<TResponse = null, TRequest = null>(
  url: string,
  {
    method = "GET",
    data,
    params,
    headers = {},
    contentType,
    customBaseUrl,
    protected: isProtected = false,
  }: ApiRequestOptions<TRequest> = {}
): Promise<ApiResponse<TResponse>> {
  let finalHeaders: Record<string, string> = { ...headers };
  let credentials = false;
  if (!(data instanceof FormData)) {
    finalHeaders["Content-Type"] = contentType || "application/json";
  }
  if (isProtected) {
    credentials = true;
  }

  const instance = axiosInstance(customBaseUrl || BASE_URL, contentType);

  try {
    const res = await instance.request<ApiResponse<TResponse>>({
      url,
      withCredentials: credentials,
      method,
      data,
      params,
      headers: finalHeaders,
    });

    return res.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as ApiResponse<TResponse>;
    }
    return {
      success: false,
      message: error.message || "Unexpected error",
      errors: [error.message],
    };
  }
}
