import axios, { Method } from "axios";

const api = axios.create({
  baseURL: `/api`,
  withCredentials: true,
  validateStatus:()=>true
});

/**
 * Generic API request utility
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param url - API endpoint
 * @param data - Request body
 * @param params - Query params
 */
export async function apiRequestClient<T>(
  method: Method,
  url: string,
  {
    data,
    params,
  }: {
    data?: Record<string, unknown> | FormData;
    params?: Record<string, unknown>;
  } = {}
): Promise<T> {
  try {
    const res = await api.request<T>({
      method,
      url,
      data,
      params,
    });
    return res.data;
  } catch (err: unknown) {
    console.error(`Unexpected API error:`, err);
    throw err;
  }
}
