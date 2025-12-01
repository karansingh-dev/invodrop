import { createClientSchema } from "@/schema/client";
import z from "zod";

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  error: string | null;
  data: T;
  pagination: {
    total: number;
    page: number;
    totalPages: number;
    limit: number;
    order: "desc" | "asc";
  } | null;
}

export type ORDER = "desc" | "asc";

export type CreateClientDataType = z.infer<typeof createClientSchema>;

export interface Client {
  address: string;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  email: string;
  contactPerson: string | null;
  isActive: boolean;
  country: string;
  pincode: string;
  invoiceCount: number;
  totalBilledAmount: string;
}

export type ClientStatus = "all" | "active" | "inactive";
