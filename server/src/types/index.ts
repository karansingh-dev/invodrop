export interface PaginationParameters {
  limit: string;
  page: string;
  order: PrismaOrder;
}

export interface Pagination {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  order: string;
}

type SuccessWithData<T> = {
  success: true;
  message: string;
  data: T;
  pagination?: Pagination;
};

type SuccessWithoutData = {
  success: true;
  message: string;
};

export type ApiResponse<T = null> =
  | SuccessWithData<T>
  | SuccessWithoutData
  | {
      success: false;
      error: string;
    };

export type PrismaOrder = "desc" | "asc";